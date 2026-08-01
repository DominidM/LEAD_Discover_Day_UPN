import type { Pilar, StepConfig } from "./constants";

// ============================================================
// LEAD-GUÍA · Preguntas de la conversación guiada
// Cada paso acumula un campo en el JSON de `UserData`.
// ============================================================

export const steps: StepConfig[] = [
  {
    id: "nombre",
    field: "nombre",
    type: "text",
    question: "Para empezar, ¿cómo te llamas?",
    prompt: "Escribe tu nombre",
    options: [],
  },
  {
    id: "cursos",
    field: "cursos_preferidos",
    type: "multi-select",
    question: "¿Qué cursos o áreas te llaman más la atención?",
    prompt: "Elige todos los que apliquen",
    options: [
      "Programación y tecnología",
      "Matemáticas y ciencias",
      "Comunicación y marketing",
      "Negocios y finanzas",
      "Diseño y creatividad",
      "Ingeniería",
      "Ciencias de la salud",
      "Derecho y humanidades",
    ],
  },
  {
    id: "hobbies",
    field: "hobbies",
    type: "multi-select",
    question: "¿Qué te gusta hacer en tu tiempo libre?",
    prompt: "Elige todos los que apliquen",
    options: [
      "Videojuegos",
      "Leer",
      "Deporte",
      "Música",
      "Voluntariado",
      "Arte y diseño",
      "Tecnología y gadgets",
      "Escribir",
      "Viajar",
      "Emprender",
    ],
  },
  {
    id: "habilidad",
    field: "habilidad_a_desarrollar",
    type: "single-select",
    question: "¿Qué habilidad te gustaría desarrollar?",
    prompt: "Elige una",
    options: [
      "Liderazgo",
      "Programación",
      "Comunicación",
      "Pensamiento crítico",
      "Creatividad",
      "Trabajo en equipo",
      "Emprendimiento",
      "Resolución de problemas",
    ],
  },
  {
    id: "motivacion",
    field: "motivacion",
    type: "text",
    question: "Última pregunta… ¿qué te motiva a lograrlo?",
    prompt: "Cuéntame tu motivación",
    options: [],
  },
];

// ============================================================
// Pilares del ecosistema LEAD UPN usados como contexto del mentor
// ============================================================

export const pilares: Pilar[] = [
  {
    id: "liderazgo",
    nombre: "Liderazgo",
    tagline: "Conduce con propósito",
    descripcion:
      "Desarrollas la capacidad de inspirar, comunicar y mover a otros. Tu perfil brilla en equipos y proyectos donde tu voz guía.",
    ruta: "Comunidad de líderes estudiantiles y mentorías",
    acciones: [
      "Únete a un comité o grupo estudiantil de LEAD",
      "Participa en los talleres de liderazgo y comunicación",
      "Propón y lidera un proyecto para tu facultad",
    ],
    color: "#ffb819",
  },
  {
    id: "innovacion",
    nombre: "Innovación y tecnología",
    tagline: "Construye lo que viene",
    descripcion:
      "Tu curiosidad por la tecnología te convierte en creador. Te mueves natural entre ideas, prototipos y soluciones del futuro.",
    ruta: "Hackatones, laboratorios STEM y proyectos tech",
    acciones: [
      "Inscríbete en el próximo hackatón de LEAD",
      "Únete a un equipo de proyectos STEM",
      "Aprende nuevas herramientas en los talleres tech",
    ],
    color: "#ffd04a",
  },
  {
    id: "impacto",
    nombre: "Impacto social",
    tagline: "Transforma tu entorno",
    descripcion:
      "Te importa la gente y tu comunidad. Tu energía tiene el poder de generar cambios reales que van más allá del aula.",
    ruta: "Voluntariado y proyectos de impacto comunitario",
    acciones: [
      "Suma tu energía a las jornadas de voluntariado",
      "Diseña una iniciativa para tu comunidad",
      "Sé embajador del cambio en tu campus",
    ],
    color: "#e54e65",
  },
  {
    id: "desarrollo",
    nombre: "Desarrollo profesional",
    tagline: "Construye tu futuro",
    descripcion:
      "Tienes los pies en la tierra y la mirada en el futuro. Tu foco está en crecer, conectar y abrir puertas profesionales.",
    ruta: "Empleabilidad, red de contactos y marca personal",
    acciones: [
      "Arma tu perfil profesional con el apoyo de LEAD",
      "Conecta con mentores y egresados",
      "Participa en ferias de empleabilidad y talleres de CV",
    ],
    color: "#7e34a0",
  },
];

export const pilarPorId = (id: string): Pilar =>
  pilares.find((p) => p.id === id) ?? pilares[0];
