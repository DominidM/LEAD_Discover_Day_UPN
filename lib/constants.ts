import type { UserData } from "./ai/mentor";

export const BRAND_NAME = "LEAD-GUÍA";
export const ORG_NAME = "LEAD UPN";
export const TAGLINE = "Tu mentor IA de LEAD UPN.";

export type StepType = "text" | "multi-select" | "single-select";

export interface StepConfig {
  id: string;
  field: keyof UserData;
  type: StepType;
  question: string;
  prompt: string;
  options: string[];
}

export interface Pilar {
  id: string;
  nombre: string;
  tagline: string;
  descripcion: string;
  ruta: string;
  acciones: string[];
  color: string;
}
