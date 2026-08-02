import type { Pilar, StepConfig } from "./constants";

// ============================================================
// LEAD · Preguntas de la conversación guiada
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
    ruta: "Charla de Liderazgo: tu voz como guía",
    acciones: [
      "Asiste a la charla de Liderazgo del Discover Day",
      "Escucha las historias de los expositores",
      "Pregunta cómo empezar a liderar desde ahora",
    ],
    color: "#ffb819",
    imagen: "/assets/lead/excelencia_femenina.NCZXg3Ri.webp",
  },
  {
    id: "innovacion",
    nombre: "Innovación y tecnología",
    tagline: "Construye lo que viene",
    descripcion:
      "Tu curiosidad por la tecnología te convierte en creador. Te mueves natural entre ideas, prototipos y soluciones del futuro.",
    ruta: "Charla de Innovación y tecnología: crea lo que viene",
    acciones: [
      "Asiste a la charla de Innovación y tecnología",
      "Descubre qué es innovar con ejemplos reales",
      "Pregunta cómo explorar la tecnología y crear ideas",
    ],
    color: "#ffd04a",
    imagen: "/assets/lead/lead_academia.DNA_qFqj.webp",
  },
  {
    id: "impacto",
    nombre: "Impacto social",
    tagline: "Transforma tu entorno",
    descripcion:
      "Te importa la gente y tu comunidad. Tu energía tiene el poder de generar cambios reales que van más allá del aula.",
    ruta: "Charla de Impacto social: transforma tu entorno",
    acciones: [
      "Asiste a la charla de Impacto social",
      "Conoce historias de cambio y voluntariado",
      "Pregunta cómo generar impacto en tu comunidad",
    ],
    color: "#e54e65",
    imagen: "/assets/lead/impacto_comunitario.DqNJq7Zk.webp",
  },
  {
    id: "desarrollo",
    nombre: "Desarrollo profesional",
    tagline: "Construye tu futuro",
    descripcion:
      "Tienes los pies en la tierra y la mirada en el futuro. Tu foco está en crecer, conectar y abrir puertas profesionales.",
    ruta: "Charla de Desarrollo profesional: construye tu futuro",
    acciones: [
      "Asiste a la charla de Desarrollo profesional",
      "Escucha consejos de profesionales y egresados",
      "Pregunta cómo dar tus primeros pasos hacia tu meta",
    ],
    color: "#7e34a0",
    imagen: "/assets/lead/desarrollo_profesional.COR-ZW5U.webp",
  },
];

export const pilarPorId = (id: string): Pilar =>
  pilares.find((p) => p.id === id) ?? pilares[0];
