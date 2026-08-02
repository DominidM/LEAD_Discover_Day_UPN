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
    { pilarId: "excelencia_femenina", weight: 3 },
    { pilarId: "desarrollo_profesional", weight: 2 },
  ],
  Comunicación: [
    { pilarId: "desarrollo_capitulo", weight: 2 },
    { pilarId: "lead_academia", weight: 2 },
  ],
  "Trabajo en equipo": [
    { pilarId: "desarrollo_capitulo", weight: 3 },
    { pilarId: "impacto_comunitario", weight: 1 },
  ],
  Emprendimiento: [
    { pilarId: "desarrollo_profesional", weight: 2 },
    { pilarId: "impacto_comunitario", weight: 2 },
  ],
  Programación: [
    { pilarId: "lead_academia", weight: 3 },
    { pilarId: "desarrollo_profesional", weight: 1 },
  ],
  "Pensamiento crítico": [
    { pilarId: "lead_academia", weight: 2 },
    { pilarId: "excelencia_femenina", weight: 1 },
  ],
  Creatividad: [
    { pilarId: "desarrollo_capitulo", weight: 2 },
    { pilarId: "lead_academia", weight: 1 },
  ],
  "Resolución de problemas": [
    { pilarId: "desarrollo_profesional", weight: 2 },
    { pilarId: "lead_academia", weight: 2 },
  ],
  // Cursos
  "Programación y tecnología": [
    { pilarId: "lead_academia", weight: 3 },
    { pilarId: "desarrollo_profesional", weight: 1 },
  ],
  "Matemáticas y ciencias": [
    { pilarId: "lead_academia", weight: 2 },
    { pilarId: "desarrollo_profesional", weight: 1 },
  ],
  "Comunicación y marketing": [
    { pilarId: "desarrollo_capitulo", weight: 2 },
    { pilarId: "excelencia_femenina", weight: 2 },
  ],
  "Negocios y finanzas": [{ pilarId: "desarrollo_profesional", weight: 3 }],
  "Diseño y creatividad": [
    { pilarId: "desarrollo_capitulo", weight: 2 },
    { pilarId: "excelencia_femenina", weight: 1 },
  ],
  Ingeniería: [
    { pilarId: "desarrollo_profesional", weight: 2 },
    { pilarId: "lead_academia", weight: 1 },
  ],
  "Ciencias de la salud": [
    { pilarId: "impacto_comunitario", weight: 2 },
    { pilarId: "desarrollo_profesional", weight: 2 },
  ],
  "Derecho y humanidades": [
    { pilarId: "impacto_comunitario", weight: 2 },
    { pilarId: "excelencia_femenina", weight: 1 },
  ],
  // Hobbies
  Videojuegos: [
    { pilarId: "desarrollo_capitulo", weight: 1 },
    { pilarId: "lead_academia", weight: 1 },
  ],
  Leer: [
    { pilarId: "lead_academia", weight: 2 },
    { pilarId: "excelencia_femenina", weight: 1 },
  ],
  Deporte: [
    { pilarId: "desarrollo_capitulo", weight: 2 },
    { pilarId: "impacto_comunitario", weight: 1 },
  ],
  Música: [
    { pilarId: "desarrollo_capitulo", weight: 2 },
    { pilarId: "lead_academia", weight: 1 },
  ],
  Voluntariado: [{ pilarId: "impacto_comunitario", weight: 3 }],
  "Arte y diseño": [
    { pilarId: "desarrollo_capitulo", weight: 2 },
    { pilarId: "excelencia_femenina", weight: 2 },
  ],
  "Tecnología y gadgets": [
    { pilarId: "lead_academia", weight: 2 },
    { pilarId: "desarrollo_profesional", weight: 1 },
  ],
  Escribir: [
    { pilarId: "excelencia_femenina", weight: 2 },
    { pilarId: "lead_academia", weight: 1 },
  ],
  Viajar: [
    { pilarId: "desarrollo_capitulo", weight: 1 },
    { pilarId: "impacto_comunitario", weight: 1 },
  ],
  Emprender: [
    { pilarId: "desarrollo_profesional", weight: 2 },
    { pilarId: "impacto_comunitario", weight: 1 },
  ],
};

// Pistas de la motivación
const MOTIVACION_HINTS: Record<string, Affinity[]> = {
  voluntariado: [{ pilarId: "impacto_comunitario", weight: 2 }],
  ayudar: [
    { pilarId: "impacto_comunitario", weight: 2 },
    { pilarId: "desarrollo_capitulo", weight: 1 },
  ],
  comunidad: [
    { pilarId: "impacto_comunitario", weight: 2 },
    { pilarId: "desarrollo_capitulo", weight: 1 },
  ],
  cambio: [{ pilarId: "impacto_comunitario", weight: 2 }],
  solidaridad: [{ pilarId: "impacto_comunitario", weight: 2 }],
  servicio: [{ pilarId: "impacto_comunitario", weight: 2 }],
  trabajo: [{ pilarId: "desarrollo_profesional", weight: 2 }],
  dinero: [{ pilarId: "desarrollo_profesional", weight: 2 }],
  empleo: [{ pilarId: "desarrollo_profesional", weight: 2 }],
  carrera: [{ pilarId: "desarrollo_profesional", weight: 2 }],
  profesional: [{ pilarId: "desarrollo_profesional", weight: 2 }],
  negocios: [{ pilarId: "desarrollo_profesional", weight: 2 }],
  crear: [
    { pilarId: "desarrollo_capitulo", weight: 1 },
    { pilarId: "lead_academia", weight: 1 },
  ],
  enseñar: [{ pilarId: "lead_academia", weight: 3 }],
  compartir: [{ pilarId: "lead_academia", weight: 2 }],
  aprender: [{ pilarId: "lead_academia", weight: 2 }],
  educación: [{ pilarId: "lead_academia", weight: 2 }],
  capacitación: [{ pilarId: "lead_academia", weight: 2 }],
  conocimiento: [{ pilarId: "lead_academia", weight: 2 }],
  tecnologia: [{ pilarId: "lead_academia", weight: 2 }],
  programar: [{ pilarId: "lead_academia", weight: 2 }],
  futuro: [{ pilarId: "desarrollo_profesional", weight: 2 }],
  liderar: [
    { pilarId: "excelencia_femenina", weight: 2 },
    { pilarId: "desarrollo_profesional", weight: 1 },
  ],
  dirigir: [
    { pilarId: "excelencia_femenina", weight: 2 },
    { pilarId: "desarrollo_profesional", weight: 1 },
  ],
  empoderar: [{ pilarId: "excelencia_femenina", weight: 2 }],
  equidad: [{ pilarId: "excelencia_femenina", weight: 2 }],
  sororidad: [{ pilarId: "excelencia_femenina", weight: 3 }],
  mujer: [{ pilarId: "excelencia_femenina", weight: 2 }],
  inspirar: [{ pilarId: "excelencia_femenina", weight: 2 }],
  integrar: [{ pilarId: "desarrollo_capitulo", weight: 3 }],
  equipo: [{ pilarId: "desarrollo_capitulo", weight: 2 }],
  pertenencia: [{ pilarId: "desarrollo_capitulo", weight: 2 }],
  cultura: [{ pilarId: "desarrollo_capitulo", weight: 2 }],
  eventos: [{ pilarId: "desarrollo_capitulo", weight: 2 }],
  unión: [{ pilarId: "desarrollo_capitulo", weight: 2 }],
};

// Orden de desempate
const TIEBREAK = [
  "impacto_comunitario",
  "desarrollo_profesional",
  "desarrollo_capitulo",
  "excelencia_femenina",
  "lead_academia",
];

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
      imagen: pilar.imagen,
      closing: `¡Listo, ${nombre}! Tu perfil conecta con el pilar de ${pilar.nombre}. Nos vemos en la charla del Discover Day.`,
    };
  }
}
