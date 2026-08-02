var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// ../lib/mock-data.ts
var pilares = [
  {
    id: "impacto_comunitario",
    nombre: "Impacto Comunitario",
    tagline: "El verdadero liderazgo se demuestra cuando ayudas a transformar vidas.",
    descripcion: "Convierte ideas en proyectos sociales que beneficien a personas, comunidades y causas con prop\xF3sito antes de graduarte. Tu vocaci\xF3n de servicio y empat\xEDa te impulsan a dejar huella en tu entorno.",
    ruta: "Charla de Impacto Comunitario: transforma vidas desde ya",
    acciones: [
      "Asiste a la charla de Impacto Comunitario del Discover Day",
      "Organiza campa\xF1as solidarias y proyectos sociales",
      "Colabora con organizaciones y comunidades reales"
    ],
    color: "#e54e65",
    imagen: "https://res.cloudinary.com/dpnxbnqxu/image/upload/v1785680244/IMPACT-COMUNITARIO_wcg4wb.webp",
    foto: "https://res.cloudinary.com/dpnxbnqxu/image/upload/v1785680245/IMPACTO-COMUNITARIO_o3lrmz.jpg"
  },
  {
    id: "desarrollo_profesional",
    nombre: "Desarrollo Profesional",
    tagline: "Empieza a construir el profesional que quieres ser antes de graduarte.",
    descripcion: "Desarrolla habilidades clave para el mercado laboral y construye un perfil profesional de alto impacto. Tu ambici\xF3n y orientaci\xF3n a resultados te abrir\xE1n puertas.",
    ruta: "Charla de Desarrollo Profesional: construye tu carrera",
    acciones: [
      "Asiste a la charla de Desarrollo Profesional del Discover Day",
      "Participa en talleres exclusivos de empleabilidad",
      "Ampl\xEDa tu red de contactos y networking"
    ],
    color: "#7e34a0",
    imagen: "https://res.cloudinary.com/dpnxbnqxu/image/upload/v1785680244/DESARROLLO-PROFESIONAL_kshtn3.webp",
    foto: "https://res.cloudinary.com/dpnxbnqxu/image/upload/v1785680245/DESARROLLO-PROFESIONAL_fq5uzq.jpg"
  },
  {
    id: "desarrollo_capitulo",
    nombre: "Desarrollo del Cap\xEDtulo",
    tagline: "Las mejores comunidades no nacen\u2026 se construyen.",
    descripcion: "S\xE9 el coraz\xF3n de la organizaci\xF3n: fortalece la cultura, integra personas y crea un sentido de pertenencia. Eres extrovertido, integrador y haces que todos quieran participar.",
    ruta: "Charla de Desarrollo del Cap\xEDtulo: construye comunidad",
    acciones: [
      "Asiste a la charla de Desarrollo del Cap\xEDtulo del Discover Day",
      "Organiza actividades y eventos memorables",
      "Integra nuevos miembros y fortalece el equipo"
    ],
    color: "#4ecdc4",
    imagen: "https://res.cloudinary.com/dpnxbnqxu/image/upload/v1785680244/DESARROLLO-CAPITULO_byshck.webp",
    foto: "https://res.cloudinary.com/dpnxbnqxu/image/upload/v1785680245/DESARROLLO-CAPITULO_jo5kqh.jpg"
  },
  {
    id: "excelencia_femenina",
    nombre: "Excelencia Femenina",
    tagline: "Tu voz puede convertirse en la inspiraci\xF3n que otra estudiante necesita.",
    descripcion: "Crea espacios de crecimiento, inspiraci\xF3n y sororidad para impulsar el liderazgo femenino. Tu determinaci\xF3n y empat\xEDa abren camino a m\xE1s mujeres.",
    ruta: "Charla de Excelencia Femenina: inspira y lidera",
    acciones: [
      "Asiste a la charla de Excelencia Femenina del Discover Day",
      "Crea iniciativas enfocadas en mujeres l\xEDderes",
      "Construye redes de apoyo y sororidad"
    ],
    color: "#ffb819",
    imagen: "https://res.cloudinary.com/dpnxbnqxu/image/upload/v1785680244/IMPACTO-FEMENINA_z9kj1q.webp",
    foto: "https://res.cloudinary.com/dpnxbnqxu/image/upload/v1785680245/IMPACTO-FEMENINA_gs9q07.jpg"
  },
  {
    id: "lead_academia",
    nombre: "LEAD Academia",
    tagline: "Ense\xF1ar tambi\xE9n es una forma de liderar.",
    descripcion: "Comparte conocimientos con otros estudiantes, crea experiencias de aprendizaje y forma mentores mientras fortaleces tus propias habilidades. Tu pasi\xF3n por ense\xF1ar transforma.",
    ruta: "Charla de LEAD Academia: ense\xF1a y lidera",
    acciones: [
      "Asiste a la charla de LEAD Academia del Discover Day",
      "Dise\xF1a talleres y capacitaciones para otros estudiantes",
      "Convi\xE9rtete en mentor de nuevos miembros"
    ],
    color: "#ffd04a",
    imagen: "https://res.cloudinary.com/dpnxbnqxu/image/upload/v1785680244/LEAD-ACADEMIA_b2rmlt.webp",
    foto: "https://res.cloudinary.com/dpnxbnqxu/image/upload/v1785680245/LEAD-ACADEMIA_yrgrcg.jpg"
  }
];

// api/mentor.ts
var DEFAULT_MODEL = "gemini-flash-latest";
var BASE = "https://generativelanguage.googleapis.com/v1beta";
var json = /* @__PURE__ */ __name((data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { "Content-Type": "application/json" }
}), "json");
var sleep = /* @__PURE__ */ __name((ms) => new Promise((r) => setTimeout(r, ms)), "sleep");
var keys = /* @__PURE__ */ __name((raw) => (raw ?? "").split(",").map((k) => k.trim()).filter(Boolean), "keys");
async function callGemini(prompt, apiKeys, wantJson, model, maxTokens = 1024) {
  let currentKeyIndex = 0;
  let lastErr = null;
  const attempt = /* @__PURE__ */ __name(async (apiKey) => {
    const url = `${BASE}/models/${model}:generateContent`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }], role: "user" }],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: maxTokens,
          ...wantJson ? { responseMimeType: "application/json" } : {}
        }
      })
    });
    if (!res.ok) {
      const text = await res.text();
      throw new GeminiError(res.status, `Gemini ${res.status}: ${text.slice(0, 300)}`);
    }
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  }, "attempt");
  for (let i = 0; i < apiKeys.length; i++) {
    const apiKey = apiKeys[currentKeyIndex % apiKeys.length];
    currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
    try {
      const text = await attempt(apiKey);
      if (text.trim()) return text.trim();
    } catch (e) {
      lastErr = e;
    }
  }
  for (let retry = 1; retry <= 2; retry++) {
    await sleep(2e3 + retry * 1e3);
    for (let i = 0; i < apiKeys.length; i++) {
      const apiKey = apiKeys[currentKeyIndex % apiKeys.length];
      currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
      try {
        const text = await attempt(apiKey);
        if (text.trim()) return text.trim();
      } catch (e) {
        lastErr = e;
      }
    }
  }
  throw lastErr ?? new Error("Gemini no devolvi\xF3 texto.");
}
__name(callGemini, "callGemini");
var GeminiError = class extends Error {
  static {
    __name(this, "GeminiError");
  }
  constructor(status, message) {
    super(message);
    this.status = status;
  }
};
var pilaresContext = pilares.map((p) => `- ${p.nombre}: ${p.tagline}. Ruta: ${p.ruta}`).join("\n");
function buildRecommendPrompt(userData) {
  return [
    `Act\xFAa como Auki, el mentor IA de LEAD UPN.`,
    `Un estudiante acaba de responder una conversaci\xF3n guiada.`,
    `Datos estructurados del estudiante:`,
    JSON.stringify(userData, null, 2),
    ``,
    `Pilares del ecosistema LEAD disponibles:`,
    pilaresContext,
    ``,
    `Elige UN solo pilar y genera una recomendaci\xF3n personalizada en JSON con EXACTAMENTE esta forma (sin comentarios ni texto extra):`,
    `{ "pilar": string, "tagline": string, "descripcion": string, "ruta": string, "acciones": string[], "perfil": string, "cierre": string }`,
    `Reglas:`,
    `- "pilar" debe ser el nombre EXACTO de uno de los pilares listados.`,
    `- "perfil" es un p\xE1rrafo motivador (2-3 frases) que mencione el nombre del estudiante y conecte sus respuestas con el pilar elegido.`,
    `- "descripcion" explica por qu\xE9 ese pilar conecta con lo que cont\xF3 el estudiante.`,
    `- "cierre" es un mensaje corto (1-2 frases) de Auki motiv\xE1ndolo a conocer su pilar en el Discover Day de LEAD UPN.`
  ].join("\n");
}
__name(buildRecommendPrompt, "buildRecommendPrompt");
function buildReplyPrompt(userData, message) {
  const nombre = userData.nombre.trim() || "estudiante";
  return [
    `Act\xFAa como Auki, el mentor de LEAD UPN. Est\xE1s conversando con ${nombre}.`,
    `Contexto de sus respuestas:`,
    JSON.stringify(userData, null, 2),
    ``,
    `La \xFAltima respuesta del estudiante fue: "${message}".`,
    `Responde como Auki con UN mensaje corto (1-2 frases cortas), cercano, motivador y entusiasta, reaccionando a esa respuesta.`,
    `M\xE1ximo 200 caracteres. Termina siempre con un punto final.`,
    `No hagas preguntas nuevas, no repitas literalmente sus palabras y no menciones pilares todav\xEDa.`
  ].join("\n");
}
__name(buildReplyPrompt, "buildReplyPrompt");
function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match2 = text.match(/\{[\s\S]*\}/);
    if (match2) {
      try {
        return JSON.parse(match2[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}
__name(parseJson, "parseJson");
function matchPilar(name) {
  const norm = (name ?? "").toLowerCase().trim();
  if (norm) {
    const found = pilares.find(
      (p) => p.nombre.toLowerCase() === norm || norm.includes(p.nombre.toLowerCase())
    );
    if (found) return found;
  }
  return pilares[0];
}
__name(matchPilar, "matchPilar");
async function recommend(userData, apiKeys, model) {
  const text = await callGemini(buildRecommendPrompt(userData), apiKeys, true, model);
  const parsed = parseJson(text) ?? {};
  const pilar = matchPilar(String(parsed.pilar ?? ""));
  const nombre = userData.nombre.trim() || "estudiante";
  const str = /* @__PURE__ */ __name((v, fallback) => typeof v === "string" && v.trim() ? v.trim() : fallback, "str");
  const arr = /* @__PURE__ */ __name((v, fallback) => Array.isArray(v) && v.length > 0 ? v.map(String) : fallback, "arr");
  return {
    nombre,
    pilarId: pilar.id,
    pilar: pilar.nombre,
    tagline: pilar.tagline,
    descripcion: str(parsed.descripcion, pilar.descripcion),
    ruta: str(parsed.ruta, pilar.ruta),
    acciones: arr(parsed.acciones, pilar.acciones),
    color: pilar.color,
    perfil: str(
      parsed.perfil,
      `\xA1${nombre}, tu perfil conecta con el pilar de ${pilar.nombre}!`
    ),
    imagen: pilar.imagen,
    foto: pilar.foto,
    closing: str(
      parsed.cierre,
      `\xA1Listo, ${nombre}! Tu pilar es ${pilar.nombre}. Nos vemos en el Discover Day.`
    )
  };
}
__name(recommend, "recommend");
async function onRequestPost(context) {
  const { request, env } = context;
  const apiKeys = keys(env.API_KEY_GEMINI);
  if (apiKeys.length === 0) {
    return json({ error: "API_KEY_GEMINI no configurada en el entorno." }, 500);
  }
  const model = env.GEMINI_MODEL || DEFAULT_MODEL;
  try {
    const body = await request.json();
    const userData = body.userData;
    if (!userData) {
      return json({ error: "Falta userData." }, 400);
    }
    if (body.mode === "reply") {
      const text = await callGemini(
        buildReplyPrompt(userData, body.message ?? ""),
        apiKeys,
        false,
        model,
        280
      );
      return json({ reply: text });
    }
    const ruta = await recommend(userData, apiKeys, model);
    return json({ ruta });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[api/mentor] error:", e);
    return json({ error: message, detail: "Revisa los logs de wrangler para m\xE1s informaci\xF3n." }, 500);
  }
}
__name(onRequestPost, "onRequestPost");

// ../.wrangler/tmp/pages-eAtUOM/functionsRoutes-0.37809692322368016.mjs
var routes = [
  {
    routePath: "/api/mentor",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost]
  }
];

// ../node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys2 = [];
  var re = pathToRegexp(str, keys2, options);
  return regexpToFunction(re, keys2, options);
}
__name(match, "match");
function regexpToFunction(re, keys2, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys2[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys2) {
  if (!keys2)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys2.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys2, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys2, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys2, options) {
  return tokensToRegexp(parse(path, options), keys2, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys2, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys2)
          keys2.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys2, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys2);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys2, options);
  return stringToRegexp(path, keys2, options);
}
__name(pathToRegexp, "pathToRegexp");

// ../node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");

// ../node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    const body = JSON.stringify(error);
    const headers = {
      "Content-Type": "application/json",
      "MF-Experimental-Error-Stack": "true"
    };
    const encoded = encodeURIComponent(body);
    if (encoded.length <= 8192) {
      headers["MF-Experimental-Error-Stack-Payload"] = encoded;
    }
    return new Response(body, { status: 500, headers });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// ../.wrangler/tmp/bundle-lK7fUZ/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_template_worker_default;

// ../node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// ../.wrangler/tmp/bundle-lK7fUZ/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=functionsWorker-0.9064417203802059.mjs.map
