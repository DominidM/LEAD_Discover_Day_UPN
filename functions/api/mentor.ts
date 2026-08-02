// ============================================================
// Cloudflare Pages Function · Proxy seguro hacia Gemini.
// La API key vive en el servidor (env.API_KEY_GEMINI), nunca en el
// navegador. El cliente llama a POST /api/mentor y aquí se construye
// el prompt, se llama a Gemini y se sanean las respuestas.
// ============================================================

import { pilares } from "../../lib/mock-data";
import type { RutaSugerida, UserData } from "../../lib/ai/mentor";

const DEFAULT_MODEL = "gemini-flash-latest";
const BASE = "https://generativelanguage.googleapis.com/v1beta";

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const keys = (raw?: string): string[] =>
  (raw ?? "")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

// Replica el esquema que ya funciona en GuardaYaApp:
//  - modelo gemini-flash-latest
//  - key en header "x-goog-api-key" (no en la URL)
//  - rotación entre varias keys separadas por coma
//  - ante 401/429/503 reintenta todas las keys con backoff
async function callGemini(
  prompt: string,
  apiKeys: string[],
  wantJson: boolean,
  model: string,
  maxTokens = 1024,
): Promise<string> {
  let currentKeyIndex = 0;
  let lastErr: unknown = null;

  const attempt = async (apiKey: string): Promise<string> => {
    const url = `${BASE}/models/${model}:generateContent`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }], role: "user" }],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: maxTokens,
          ...(wantJson ? { responseMimeType: "application/json" } : {}),
        },
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new GeminiError(res.status, `Gemini ${res.status}: ${text.slice(0, 300)}`);
    }
    const data = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  };

  // Pase 1: rotación simple por todas las keys (sin espera).
  for (let i = 0; i < apiKeys.length; i++) {
    const apiKey = apiKeys[currentKeyIndex % apiKeys.length];
    currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
    try {
      const text = await attempt(apiKey);
      if (text.trim()) return text.trim();
    } catch (e) {
      lastErr = e;
    }
  }

  // Pase 2: backoff y reintento (como GuardaYa).
  for (let retry = 1; retry <= 2; retry++) {
    await sleep(2000 + retry * 1000);
    for (let i = 0; i < apiKeys.length; i++) {
      const apiKey = apiKeys[currentKeyIndex % apiKeys.length];
      currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
      try {
        const text = await attempt(apiKey);
        if (text.trim()) return text.trim();
      } catch (e) {
        lastErr = e;
      }
    }
  }

  throw lastErr ?? new Error("Gemini no devolvió texto.");
}

class GeminiError extends Error {
  readonly status?: number;
  constructor(status: number | undefined, message: string) {
    super(message);
    this.status = status;
  }
}

// ------------------------------------------------------------
// Contexto de pilares para el prompt
// ------------------------------------------------------------

const pilaresContext = pilares
  .map((p) => `- ${p.nombre}: ${p.tagline}. Ruta: ${p.ruta}`)
  .join("\n");

function buildRecommendPrompt(userData: UserData): string {
  return [
    `Actúa como Auki, el mentor IA de LEAD UPN.`,
    `Un estudiante acaba de responder una conversación guiada.`,
    `Datos estructurados del estudiante:`,
    JSON.stringify(userData, null, 2),
    ``,
    `Pilares del ecosistema LEAD disponibles:`,
    pilaresContext,
    ``,
    `Elige UN solo pilar y genera una recomendación personalizada en JSON con EXACTAMENTE esta forma (sin comentarios ni texto extra):`,
    `{ "pilar": string, "tagline": string, "descripcion": string, "ruta": string, "acciones": string[], "perfil": string, "cierre": string }`,
    `Reglas:`,
    `- "pilar" debe ser el nombre EXACTO de uno de los pilares listados.`,
    `- "perfil" es un párrafo motivador (2-3 frases) que mencione el nombre del estudiante y conecte sus respuestas con el pilar elegido.`,
    `- "descripcion" explica por qué ese pilar conecta con lo que contó el estudiante.`,
    `- "cierre" es un mensaje corto (1-2 frases) de Auki motivándolo a conocer su pilar en el Discover Day de LEAD UPN.`,
  ].join("\n");
}

function buildReplyPrompt(userData: UserData, message: string): string {
  const nombre = userData.nombre.trim() || "estudiante";
  return [
    `Actúa como Auki, el mentor de LEAD UPN. Estás conversando con ${nombre}.`,
    `Contexto de sus respuestas:`,
    JSON.stringify(userData, null, 2),
    ``,
    `La última respuesta del estudiante fue: "${message}".`,
    `Responde como Auki con un mensaje de 3-4 frases completas, cercano, motivador y entusiasta, reaccionando a esa respuesta.`,
    `El mensaje debe terminar con un punto final y no quedar a medio escribir.`,
    `No uses emojis. No uses rótulos, numeración ni texto como "Checking Sentence Count". Escribe solo el mensaje de Auki.`,
    `No hagas preguntas nuevas, no repitas literalmente sus palabras y no menciones pilares todavía.`,
  ].join("\n");
}

// ------------------------------------------------------------
// Helpers de parseo
// ------------------------------------------------------------

function parseJson(text: string): Record<string, unknown> | null {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

function matchPilar(name?: string) {
  const norm = (name ?? "").toLowerCase().trim();
  if (norm) {
    const found = pilares.find(
      (p) =>
        p.nombre.toLowerCase() === norm ||
        norm.includes(p.nombre.toLowerCase()),
    );
    if (found) return found;
  }
  return pilares[0];
}

async function recommend(
  userData: UserData,
  apiKeys: string[],
  model: string,
): Promise<RutaSugerida> {
  const text = await callGemini(buildRecommendPrompt(userData), apiKeys, true, model, 1552);
  const parsed = parseJson(text) ?? {};
  const pilar = matchPilar(String(parsed.pilar ?? ""));
  const nombre = userData.nombre.trim() || "estudiante";

  const str = (v: unknown, fallback: string) =>
    typeof v === "string" && v.trim() ? v.trim() : fallback;
  const arr = (v: unknown, fallback: string[]) =>
    Array.isArray(v) && v.length > 0 ? v.map(String) : fallback;

  return {
    nombre,
    pilarId: pilar.id,
    pilar: pilar.nombre,
    tagline: pilar.tagline,
    descripcion: str(parsed.descripcion, pilar.descripcion),
    ruta: str(parsed.ruta, pilar.ruta),
    acciones: arr(parsed.acciones, pilar.acciones),
    color: pilar.color,
    perfil: str(
      parsed.perfil,
      `¡${nombre}, tu perfil conecta con el pilar de ${pilar.nombre}!`,
    ),
    imagen: pilar.imagen,
    foto: pilar.foto,
    closing: str(
      parsed.cierre,
      `¡Listo, ${nombre}! Tu pilar es ${pilar.nombre}. Nos vemos en el Discover Day.`,
    ),
  } satisfies RutaSugerida;
}

// ------------------------------------------------------------
// Handler
// ------------------------------------------------------------

export interface Env {
  API_KEY_GEMINI?: string;
  GEMINI_MODEL?: string;
}

export async function onRequestPost(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  const { request, env } = context;
  const apiKeys = keys(env.API_KEY_GEMINI);
  if (apiKeys.length === 0) {
    return json({ error: "API_KEY_GEMINI no configurada en el entorno." }, 500);
  }
  const model = env.GEMINI_MODEL || DEFAULT_MODEL;

  try {
    const body = (await request.json()) as {
      mode?: string;
      userData?: UserData;
      message?: string;
    };
    const userData = body.userData;
    if (!userData) {
      return json({ error: "Falta userData." }, 400);
    }

    if (body.mode === "reply") {
      const text = await callGemini(
        buildReplyPrompt(userData, body.message ?? ""),
        apiKeys,
        false,
        model,
        700,
      );
      return json({ reply: text });
    }

    const ruta = await recommend(userData, apiKeys, model);
    return json({ ruta });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[api/mentor] error:", e);
    return json({ error: message, detail: "Revisa los logs de wrangler para más información." }, 500);
  }
}