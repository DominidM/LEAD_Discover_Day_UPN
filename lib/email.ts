// ============================================================
// Email · Envío de la ruta del pilar al correo del usuario.
// Redirige a la Cloudflare Pages Function /api/email (Brevo), que
// envía al destinatario (to) y a una copia (bcc) en el servidor.
// La API key de Brevo vive en el servidor, nunca en el navegador.
// ============================================================

import type { RutaSugerida } from "./ai/mentor";

export interface EmailStatus {
  success: boolean;
  message: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function sendPilarEmail(
  email: string,
  result: RutaSugerida,
): Promise<EmailStatus> {
  if (!email || !EMAIL_REGEX.test(email)) {
    return { success: false, message: "Ingresa un correo válido." };
  }

  try {
    const res = await fetch("/api/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, result }),
    });

    const data = (await res.json().catch(() => ({}))) as {
      success?: boolean;
      message?: string;
      error?: string;
    };

    if (!res.ok) {
      return {
        success: false,
        message: data.error || `No se pudo enviar el correo (${res.status}).`,
      };
    }

    return {
      success: true,
      message: data.message || `¡Listo! Te enviamos tu ruta a ${email}.`,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[email] Error al enviar:", err);
    return { success: false, message: `No se pudo enviar el correo: ${msg}` };
  }
}