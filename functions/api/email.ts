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

function toPng(url: string): string {
  return url.replace("/upload/", "/upload/f_png/");
}

function buildHtml(r: RutaSugerida): string {
  const accionesText = r.acciones.join("\n");
  return `\
<div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif, Arial; font-size: 15px; line-height: 1.6; color: #1a1a2e;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.12);">

    <div style="background: linear-gradient(135deg, #010723 0%, #1a0b2e 100%); padding: 32px 24px; text-align: center;">
      <img src="${toPng("https://res.cloudinary.com/dpnxbnqxu/image/upload/v1785680406/logo-lead_p1ymto.webp")}" alt="Logo LEAD UPN" style="height: 58px; margin-bottom: 12px;" />
      <h1 style="margin: 0; color: #ffd04a; font-size: 22px; font-weight: 700; letter-spacing: 0.04em;">
        ¡Tu ruta LEAD UPN!
      </h1>
      <p style="margin: 8px 0 0; color: #ffffff; opacity: 0.85; font-size: 14px;">
        Descubrimos tu pilar ideal con Auki, tu mentor IA.
      </p>
    </div>

    <div style="position: relative; text-align: center; background: #f8f9fc;">
      <img src="${toPng(r.imagen)}" alt="Pilar ${r.pilar} de LEAD UPN" style="max-width: 480px; width: 45%; height: auto; display: block; margin: 0 auto;" />
    </div>

    <div style="padding: 28px 24px;">
      <p style="margin: 0 0 16px; font-size: 18px; color: #1a1a2e;">
        Hola, <strong>${r.nombre}</strong>.
      </p>
      <p style="margin: 0; color: #4a4a68;">
        ${r.perfil}
      </p>
    </div>

    <div style="padding: 0 24px 24px;">
      <div style="background: #fff9e6; border-left: 4px solid #ffd04a; border-radius: 12px; padding: 20px;">
        <h2 style="margin: 0 0 8px; color: #1a1a2e; font-size: 24px;">
          ${r.pilar}
        </h2>
        <p style="margin: 0 0 12px; color: #7e34a0; font-weight: 600; font-size: 15px;">
          ${r.tagline}
        </p>
        <p style="margin: 0; color: #4a4a68;">
          ${r.descripcion}
        </p>
      </div>
    </div>

    <div style="padding: 0 24px 24px;">
      <div style="background: #f8f9fc; border-radius: 12px; padding: 18px 20px;">
        <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.12em; color: #8b8ba3; font-weight: 700; margin-bottom: 8px;">
          Ruta recomendada
        </div>
        <div style="font-size: 17px; font-weight: 700; color: #1a1a2e;">
          ${r.ruta}
        </div>
      </div>
    </div>

    <div style="padding: 0 24px 24px;">
      <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.12em; color: #8b8ba3; font-weight: 700; margin-bottom: 14px;">
        Primeros pasos
      </div>
      <div style="white-space: pre-line; color: #4a4a68; font-size: 15px; line-height: 1.8;">
        ${accionesText}
      </div>
    </div>

    <div style="padding: 0 24px 28px;">
      <div style="background: #010723; border-radius: 12px; padding: 22px; color: #ffffff;">
        <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.12em; color: #ffd04a; font-weight: 700; margin-bottom: 10px;">
          Mensaje de Auki
        </div>
        <p style="margin: 0; font-size: 15px; line-height: 1.6;">
          ${r.closing ?? ""}
        </p>
      </div>
    </div>

    <div style="padding: 0 24px 32px; text-align: center;">
      <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.12em; color: #8b8ba3; font-weight: 700; margin-bottom: 14px;">
        Te esperamos en el Discover Day
      </div>
      <img src="${toPng(r.foto)}" alt="Foto del Discover Day LEAD UPN" style="max-width: 100%; height: auto; border-radius: 12px; display: block; margin: 0 auto;" />
    </div>

    <div style="background: #f8f9fc; padding: 24px; text-align: center; font-size: 13px; color: #8b8ba3;">
      <p style="margin: 0 0 8px;">
        <strong>LEAD UPN</strong> · Learn · Explore · Aspire · Discover
      </p>
      <p style="margin: 0;">
        Diseñado y construido por <a href="https://solvegrades.com/nosotros/" style="color: #7e34a0; text-decoration: none; font-weight: 600;">SOLVEGRADES</a>
      </p>
    </div>
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
        subject: `${result.nombre}, tu ruta LEAD UPN está lista ✨`,
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