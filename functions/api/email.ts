// ============================================================
// Cloudflare Pages Function · Envío de la ruta sugerida por email
// vía Brevo (ex-Sendinblue). La API key vive en el servidor
// (env.BREVO_API_KEY), nunca en el navegador. El cliente llama a
// POST /api/email con el correo y el resultado, y aquí se construye
// el email y se envía: al destinatario (to) y a una copia (bcc).
// ============================================================

import type { RutaSugerida } from "../../lib/ai/mentor";

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SENDER_NAME = "LEAD UPN · Auki";
const SENDER_EMAIL = "jeremyar792@gmail.com";

function buildHtml(r: RutaSugerida): string {
  const actionsHtml = r.acciones
    .map(
      (a) =>
        `<li style="margin:0 0 10px;padding:10px 14px;background:#f4f7fb;border-radius:8px;font-size:15px;line-height:1.5;color:#334155;">${a}</li>`,
    )
    .join("");
  return `
  <div style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;padding:30px 16px;background:#f1f5f9;">
    <div style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
      <div style="background:${r.color};padding:34px 24px;text-align:center;color:#ffffff;">
        <span style="font-size:12px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;">LEAD UPN · Descubre tu pilar</span>
        <h1 style="margin:12px 0 0;font-size:26px;font-weight:800;letter-spacing:-0.02em;">${r.pilar}</h1>
        <p style="margin:6px 0 0;font-size:15px;opacity:0.95;">${r.tagline}</p>
      </div>
      <div style="padding:26px 24px;">
        <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#475569;"><strong>${r.nombre}</strong>, ${r.perfil}</p>
        <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#475569;">${r.descripcion}</p>
        <div style="margin-bottom:22px;padding:16px;background:#f8fafc;border-left:4px solid ${r.color};border-radius:0 8px 8px 0;">
          <span style="font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#94a3b8;">Ruta recomendada</span>
          <p style="margin:6px 0 0;font-size:18px;font-weight:700;color:#0f172a;">${r.ruta}</p>
        </div>
        <span style="font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#94a3b8;">Primeros pasos</span>
        <ol style="margin:10px 0 0;padding:0;list-style:none;">${actionsHtml}</ol>
        <p style="margin:22px 0 0;font-size:15px;line-height:1.6;color:#475569;">${r.closing ?? ""}</p>
      </div>
      <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:18px 24px;text-align:center;font-size:12px;color:#94a3b8;">Ecosistema LEAD UPN · Nos vemos en el Discover Day</div>
    </div>
  </div>`;
}

export interface Env {
  BREVO_API_KEY?: string;
}

export async function onRequestPost(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  const { request, env } = context;
  const apiKey = env.BREVO_API_KEY;
  if (!apiKey) {
    return json({ error: "BREVO_API_KEY no configurada en el entorno." }, 500);
  }

  try {
    const body = (await request.json()) as {
      email?: string;
      result?: RutaSugerida;
    };
    const email = body.email;
    const result = body.result;

    if (!email || !EMAIL_REGEX.test(email)) {
      return json({ error: "Ingresa un correo válido." }, 400);
    }
    if (!result) {
      return json({ error: "Falta el resultado (ruta) a enviar." }, 400);
    }

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        sender: { name: SENDER_NAME, email: SENDER_EMAIL },
        replyTo: { email: SENDER_EMAIL, name: "LEAD UPN" },
        to: [{ email, name: result.nombre || email }],
        bcc: [{ email: SENDER_EMAIL, name: "LEAD UPN" }],
        subject: `Tu ruta personalizada · ${result.pilar} | LEAD UPN`,
        htmlContent: buildHtml(result),
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return json(
        { error: "Fallo al enviar el correo con Brevo", detalles: text.slice(0, 500) },
        400,
      );
    }

    return json({ success: true, message: `¡Listo! Te enviamos tu ruta a ${email}.` });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[api/email] error:", e);
    return json({ error: message }, 500);
  }
}