// ============================================================
// EmailJS · Envío de resultados del pilar al correo del usuario.
// Se ejecuta desde el navegador con la clave pública de EmailJS.
// ============================================================

import emailjs from "@emailjs/browser";
import type { RutaSugerida } from "./ai/mentor";

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "";
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "";
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "";

export interface EmailStatus {
  success: boolean;
  message: string;
}

function isConfigured(): boolean {
  return Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);
}

function getAbsoluteUrl(path: string): string {
  if (typeof window === "undefined") return path;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const origin = window.location.origin.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${cleanPath}`;
}

// Los clientes de correo (especialmente Outlook) no siempre renderizan webp.
// Convertimos automáticamente las URLs de Cloudinary a .jpg para el envío.
function toJpgCloudinaryUrl(url: string): string {
  if (!url.includes("res.cloudinary.com")) return url;
  return url.replace(/\.webp$/, ".jpg");
}

function formatActions(acciones: string[]): string {
  return acciones.map((a) => `• ${a}`).join("\n");
}

export async function sendPilarEmail(
  email: string,
  result: RutaSugerida,
): Promise<EmailStatus> {
  if (!isConfigured()) {
    return {
      success: false,
      message: "EmailJS no está configurado. Revisa las variables de entorno.",
    };
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, message: "Ingresa un correo válido." };
  }

  const templateParams = {
    to_email: email,
    to_name: result.nombre,
    pilar: result.pilar,
    tagline: result.tagline,
    descripcion: result.descripcion,
    perfil: result.perfil,
    ruta: result.ruta,
    acciones: formatActions(result.acciones),
    closing: result.closing ?? "",
    imagen_pilar_url: toJpgCloudinaryUrl(getAbsoluteUrl(result.imagen)),
    imagen_foto_url: toJpgCloudinaryUrl(getAbsoluteUrl(result.foto)),
  };

  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
    return {
      success: true,
      message: `¡Listo! Te enviamos tu ruta a ${email}.`,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[EmailJS] Error al enviar:", err);
    return {
      success: false,
      message: `No se pudo enviar el correo: ${msg}`,
    };
  }
}
