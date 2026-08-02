import type { MentorProvider, RutaSugerida, UserData } from "./mentor";
import { pilares } from "../mock-data";

// ============================================================
// GeminiMentor · FASE 2 (no activo)
// Mismo contrato que MockMentor. Construye el prompt contextual
// con los datos del usuario + pilares + contexto y lo envía a
// la API de Gemini. Para activarlo, reemplaza el proveedor en
// components/MentorExperience.tsx y añade tu API key.
// ============================================================

export const buildPrompt = (userData: UserData): string => {
  const contexto = pilares
    .map((p) => `- ${p.nombre}: ${p.tagline}. Ruta: ${p.ruta}`)
    .join("\n");

  return [
    `Actúa como LEAD-GUÍA, el mentor IA de LEAD UPN.`,
    `Un estudiante (cachimbo o de secundaria) acaba de responder una conversación guiada.`,
    `Usa EXCLUSIVAMENTE estos datos estructurados del estudiante:`,
    JSON.stringify(userData, null, 2),
    ``,
    `Pilares del ecosistema LEAD disponibles:`,
    contexto,
    ``,
    `Con base en los datos, genera una recomendación personalizada en JSON con esta forma:`,
    `{ "pilar": string, "tagline": string, "descripcion": string, "ruta": string, "acciones": string[], "perfil": string }`,
    `El campo "perfil" debe ser un párrafo motivador que mencione el nombre del estudiante y conecte sus respuestas.`,
  ].join("\n");
};

export class GeminiMentor implements MentorProvider {
  async getRecommendation(userData: UserData): Promise<RutaSugerida> {
    void userData;
    // Fase 2: usar buildPrompt(userData) como contenido del prompt y
    // enviarlo a la API de Gemini.
    //
    // Ejemplo con @google/genai:
    // const response = await client.models.generateContent({
    //   model: "gemini-2.0-flash",
    //   contents: buildPrompt(userData),
    // });
    // return parseJson(response.text);

    throw new Error(
      "GeminiMentor no está configurado aún. Conecta tu API en la fase 2.",
    );
  }
}
