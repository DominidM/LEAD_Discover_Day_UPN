// ============================================================
// Auki · Contrato del proveedor de IA (fase 2: Gemini)
// La UI solo conoce este contrato; el proveedor es intercambiable.
// ============================================================

/** Datos estructurados recolectados en la conversación (JSON). */
export interface UserData {
  nombre: string;
  cursos_preferidos: string[];
  hobbies: string[];
  habilidad_a_desarrollar: string;
  motivacion: string;
}

/** Resultado personalizado que devuelve el mentor. */
export interface RutaSugerida {
  nombre: string;
  pilarId: string;
  pilar: string;
  tagline: string;
  descripcion: string;
  ruta: string;
  acciones: string[];
  color: string;
  perfil: string;
  imagen: string;
  foto: string;
  /** Mensaje de cierre que Auki muestra en el chat (generado por IA). */
  closing?: string;
}

export const emptyUserData = (): UserData => ({
  nombre: "",
  cursos_preferidos: [],
  hobbies: [],
  habilidad_a_desarrollar: "",
  motivacion: "",
});

/** Contrato que deben cumplir MockMentor (v1) y GeminiMentor (fase 2). */
export interface MentorProvider {
  getRecommendation(userData: UserData): Promise<RutaSugerida>;
}
