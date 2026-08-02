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
    id: "impacto_comunitario",
    nombre: "Impacto Comunitario",
    tagline: "El verdadero liderazgo se demuestra cuando ayudas a transformar vidas.",
    descripcion:
      "Convierte ideas en proyectos sociales que beneficien a personas, comunidades y causas con propósito antes de graduarte. Tu vocación de servicio y empatía te impulsan a dejar huella en tu entorno.",
    ruta: "Charla de Impacto Comunitario: transforma vidas desde ya",
    acciones: [
      "Asiste a la charla de Impacto Comunitario del Discover Day",
      "Organiza campañas solidarias y proyectos sociales",
      "Colabora con organizaciones y comunidades reales",
    ],
    color: "#e54e65",
    imagen: "https://res.cloudinary.com/dpnxbnqxu/image/upload/v1785680244/IMPACT-COMUNITARIO_wcg4wb.webp",
    foto: "https://res.cloudinary.com/dpnxbnqxu/image/upload/v1785680245/IMPACTO-COMUNITARIO_o3lrmz.jpg",
  },
  {
    id: "desarrollo_profesional",
    nombre: "Desarrollo Profesional",
    tagline: "Empieza a construir el profesional que quieres ser antes de graduarte.",
    descripcion:
      "Desarrolla habilidades clave para el mercado laboral y construye un perfil profesional de alto impacto. Tu ambición y orientación a resultados te abrirán puertas.",
    ruta: "Charla de Desarrollo Profesional: construye tu carrera",
    acciones: [
      "Asiste a la charla de Desarrollo Profesional del Discover Day",
      "Participa en talleres exclusivos de empleabilidad",
      "Amplía tu red de contactos y networking",
    ],
    color: "#7e34a0",
    imagen: "https://res.cloudinary.com/dpnxbnqxu/image/upload/v1785680244/DESARROLLO-PROFESIONAL_kshtn3.webp",
    foto: "https://res.cloudinary.com/dpnxbnqxu/image/upload/v1785680245/DESARROLLO-PROFESIONAL_fq5uzq.jpg",
  },
  {
    id: "desarrollo_capitulo",
    nombre: "Desarrollo del Capítulo",
    tagline: "Las mejores comunidades no nacen… se construyen.",
    descripcion:
      "Sé el corazón de la organización: fortalece la cultura, integra personas y crea un sentido de pertenencia. Eres extrovertido, integrador y haces que todos quieran participar.",
    ruta: "Charla de Desarrollo del Capítulo: construye comunidad",
    acciones: [
      "Asiste a la charla de Desarrollo del Capítulo del Discover Day",
      "Organiza actividades y eventos memorables",
      "Integra nuevos miembros y fortalece el equipo",
    ],
    color: "#4ecdc4",
    imagen: "https://res.cloudinary.com/dpnxbnqxu/image/upload/v1785680244/DESARROLLO-CAPITULO_byshck.webp",
    foto: "https://res.cloudinary.com/dpnxbnqxu/image/upload/v1785680245/DESARROLLO-CAPITULO_jo5kqh.jpg",
  },
  {
    id: "excelencia_femenina",
    nombre: "Excelencia Femenina",
    tagline: "Tu voz puede convertirse en la inspiración que otra estudiante necesita.",
    descripcion:
      "Crea espacios de crecimiento, inspiración y sororidad para impulsar el liderazgo femenino. Tu determinación y empatía abren camino a más mujeres.",
    ruta: "Charla de Excelencia Femenina: inspira y lidera",
    acciones: [
      "Asiste a la charla de Excelencia Femenina del Discover Day",
      "Crea iniciativas enfocadas en mujeres líderes",
      "Construye redes de apoyo y sororidad",
    ],
    color: "#ffb819",
    imagen: "https://res.cloudinary.com/dpnxbnqxu/image/upload/v1785680244/IMPACTO-FEMENINA_z9kj1q.webp",
    foto: "https://res.cloudinary.com/dpnxbnqxu/image/upload/v1785680245/IMPACTO-FEMENINA_gs9q07.jpg",
  },
  {
    id: "lead_academia",
    nombre: "LEAD Academia",
    tagline: "Enseñar también es una forma de liderar.",
    descripcion:
      "Comparte conocimientos con otros estudiantes, crea experiencias de aprendizaje y forma mentores mientras fortaleces tus propias habilidades. Tu pasión por enseñar transforma.",
    ruta: "Charla de LEAD Academia: enseña y lidera",
    acciones: [
      "Asiste a la charla de LEAD Academia del Discover Day",
      "Diseña talleres y capacitaciones para otros estudiantes",
      "Conviértete en mentor de nuevos miembros",
    ],
    color: "#ffd04a",
    imagen: "https://res.cloudinary.com/dpnxbnqxu/image/upload/v1785680244/LEAD-ACADEMIA_b2rmlt.webp",
    foto: "https://res.cloudinary.com/dpnxbnqxu/image/upload/v1785680245/LEAD-ACADEMIA_yrgrcg.jpg",
  },
];

export const pilarPorId = (id: string): Pilar =>
  pilares.find((p) => p.id === id) ?? pilares[0];
