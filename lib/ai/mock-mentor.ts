import type { MentorProvider, RutaSugerida, UserData } from "./mentor";
import { pilarPorId } from "../mock-data";

// ============================================================
// MockMentor · Proveedor local (fase 1, front-only)
// Reglas simples que mapean el JSON del usuario hacia un pilar
// y construyen un perfil personalizado sin backend.
// ============================================================

interface Affinity {
  pilarId: string;
  weight: number;
}

const KEYWORDS: Record<string, Affinity[]> = {
  // Habilidades
  Liderazgo: [
    { pilarId: "liderazgo", weight: 3 },
    { pilarId: "desarrollo", weight: 1 },
  ],
  Comunicación: [
    { pilarId: "liderazgo", weight: 2 },
    { pilarId: "desarrollo", weight: 1 },
  ],
  "Trabajo en equipo": [
    { pilarId: "liderazgo", weight: 2 },
    { pilarId: "impacto", weight: 1 },
  ],
  Emprendimiento: [
    { pilarId: "desarrollo", weight: 2 },
    { pilarId: "innovacion", weight: 2 },
    { pilarId: "liderazgo", weight: 1 },
  ],
  Programación: [
    { pilarId: "innovacion", weight: 3 },
    { pilarId: "desarrollo", weight: 1 },
  ],
  "Pensamiento crítico": [{ pilarId: "innovacion", weight: 2 }],
  Creatividad: [
    { pilarId: "innovacion", weight: 2 },
    { pilarId: "impacto", weight: 1 },
  ],
  "Resolución de problemas": [
    { pilarId: "innovacion", weight: 2 },
    { pilarId: "liderazgo", weight: 1 },
  ],
  // Cursos
  "Programación y tecnología": [{ pilarId: "innovacion", weight: 2 }],
  "Matemáticas y ciencias": [
    { pilarId: "innovacion", weight: 1 },
    { pilarId: "desarrollo", weight: 1 },
  ],
  "Comunicación y marketing": [
    { pilarId: "desarrollo", weight: 2 },
    { pilarId: "liderazgo", weight: 1 },
  ],
  "Negocios y finanzas": [{ pilarId: "desarrollo", weight: 3 }],
  "Diseño y creatividad": [
    { pilarId: "innovacion", weight: 2 },
    { pilarId: "impacto", weight: 1 },
  ],
  Ingeniería: [{ pilarId: "innovacion", weight: 2 }],
  "Ciencias de la salud": [
    { pilarId: "impacto", weight: 2 },
    { pilarId: "desarrollo", weight: 1 },
  ],
  "Derecho y humanidades": [
    { pilarId: "impacto", weight: 2 },
    { pilarId: "liderazgo", weight: 1 },
  ],
  // Hobbies
  Videojuegos: [{ pilarId: "innovacion", weight: 2 }],
  Leer: [
    { pilarId: "desarrollo", weight: 1 },
    { pilarId: "liderazgo", weight: 1 },
  ],
  Deporte: [
    { pilarId: "liderazgo", weight: 1 },
    { pilarId: "impacto", weight: 1 },
  ],
  Música: [{ pilarId: "innovacion", weight: 1 }],
  Voluntariado: [{ pilarId: "impacto", weight: 3 }],
  "Arte y diseño": [{ pilarId: "innovacion", weight: 1 }],
  "Tecnología y gadgets": [{ pilarId: "innovacion", weight: 2 }],
  Escribir: [
    { pilarId: "desarrollo", weight: 1 },
    { pilarId: "impacto", weight: 1 },
  ],
  Viajar: [{ pilarId: "impacto", weight: 1 }],
  Emprender: [
    { pilarId: "desarrollo", weight: 2 },
    { pilarId: "innovacion", weight: 2 },
  ],
};

// Pistas de la motivación
const MOTIVACION_HINTS: Record<string, Affinity[]> = {
  impacto: [
    { pilarId: "impacto", weight: 2 },
    { pilarId: "liderazgo", weight: 1 },
  ],
  ayudar: [
    { pilarId: "impacto", weight: 2 },
    { pilarId: "liderazgo", weight: 1 },
  ],
  comunidad: [{ pilarId: "impacto", weight: 2 }],
  trabajo: [{ pilarId: "desarrollo", weight: 2 }],
  dinero: [{ pilarId: "desarrollo", weight: 2 }],
  empleo: [{ pilarId: "desarrollo", weight: 2 }],
  profesion: [{ pilarId: "desarrollo", weight: 2 }],
  crear: [{ pilarId: "innovacion", weight: 2 }],
  tecnologia: [{ pilarId: "innovacion", weight: 2 }],
  programar: [{ pilarId: "innovacion", weight: 2 }],
  futuro: [
    { pilarId: "desarrollo", weight: 1 },
    { pilarId: "innovacion", weight: 1 },
  ],
  dirigir: [
    { pilarId: "liderazgo", weight: 2 },
    { pilarId: "desarrollo", weight: 1 },
  ],
  liderar: [{ pilarId: "liderazgo", weight: 2 }],
};

// Orden de desempate
const TIEBREAK = ["innovacion", "liderazgo", "desarrollo", "impacto"];

export class MockMentor implements MentorProvider {
  async getRecommendation(userData: UserData): Promise<RutaSugerida> {
    const scores = new Map<string, number>();

    const apply = (affinities: Affinity[]) => {
      for (const a of affinities) {
        scores.set(a.pilarId, (scores.get(a.pilarId) ?? 0) + a.weight);
      }
    };

    apply(KEYWORDS[userData.habilidad_a_desarrollar] ?? []);

    for (const curso of userData.cursos_preferidos) apply(KEYWORDS[curso] ?? []);
    for (const hobby of userData.hobbies) apply(KEYWORDS[hobby] ?? []);

    const motivacion = userData.motivacion.toLowerCase();
    for (const [key, affinities] of Object.entries(MOTIVACION_HINTS)) {
      if (motivacion.includes(key)) apply(affinities);
    }

    let best = TIEBREAK[0];
    for (const id of TIEBREAK) {
      if ((scores.get(id) ?? 0) > (scores.get(best) ?? 0)) best = id;
    }

    const pilar = pilarPorId(best);
    const nombre = userData.nombre.trim() || "estudiante";
    const cursos = userData.cursos_preferidos.slice(0, 2).join(" y ") || "tus cursos";
    const hobbies = userData.hobbies.slice(0, 2).join(" y ") || "tus hobbies";

    const perfil = `${nombre}, todo lo que me contaste dibuja un perfil claro. Tu interés por ${userData.habilidad_a_desarrollar || "crecer"}, tu gusto por ${cursos} y tus hobbies de ${hobbies} te alinean con el pilar de ${pilar.nombre}. No es casualidad: es tu dirección natural.`;

    return {
      nombre,
      pilarId: pilar.id,
      pilar: pilar.nombre,
      tagline: pilar.tagline,
      descripcion: pilar.descripcion,
      ruta: pilar.ruta,
      acciones: pilar.acciones,
      color: pilar.color,
      perfil,
    };
  }
}
