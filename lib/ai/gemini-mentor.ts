import type { MentorProvider, RutaSugerida, UserData } from "./mentor";
import { MockMentor } from "./mock-mentor";

// ============================================================
// GeminiMentor · Proveedor real (fase 2)
// Llama a la Cloudflare Pages Function /api/mentor que acerciona
// a Gemini con la API key en el servidor. Si la API no está
// disponible (p.ej. `next dev` sin la función), cae al MockMentor
// para que la experiencia nunca se rompa.
// ============================================================

const API_URL = "/api/mentor";

export class GeminiMentor implements MentorProvider {
  private readonly fallback = new MockMentor();

  async getRecommendation(userData: UserData): Promise<RutaSugerida> {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "recommend", userData }),
      });
      if (!res.ok) throw new Error(`La API respondió ${res.status}`);
      const data = (await res.json()) as { ruta?: RutaSugerida };
      if (!data?.ruta) throw new Error("La API no devolvió una ruta");
      return data.ruta;
    } catch (err) {
      console.warn("[Auki] Gemini no disponible, usando modo local.", err);
      return this.fallback.getRecommendation(userData);
    }
  }

  async getReply(userData: UserData, message: string): Promise<string | null> {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "reply", userData, message }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.warn(`[Auki] API respondió ${res.status}: ${text.slice(0, 200)}`);
        throw new Error(`La API respondió ${res.status}`);
      }
      const data = (await res.json()) as { reply?: string };
      return data?.reply?.trim() ? data.reply.trim() : null;
    } catch (err) {
      console.warn("[Auki] Respuesta IA no disponible, usando respuesta genérica.", err);
      const nombre = userData.nombre.trim() || "estudiante";
      return `¡Gracias por compartirlo, ${nombre}! Me encanta tu energía. Sigamos con la última pregunta para descubrir tu pilar.`;
    }
  }
}