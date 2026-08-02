"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import GuiaMascot from "./ui/GuiaMascot";
import Starfield from "./ui/Starfield";
import Typewriter from "./ui/Typewriter";
import Chip from "./ui/Chip";
import Button from "./ui/Button";
import GlowCard from "./ui/GlowCard";
import ThemeToggle from "./ui/ThemeToggle";
import WelcomeScreen from "./WelcomeScreen";
import { steps } from "@/lib/mock-data";
import { emptyUserData, type RutaSugerida, type UserData } from "@/lib/ai/mentor";
import { MockMentor } from "@/lib/ai/mock-mentor";
import { ORG_NAME } from "@/lib/constants";
import styles from "./MentorExperience.module.scss";

type Entry =
  | { kind: "mentor"; text: string; id: number }
  | { kind: "user"; text: string; id: number };

let entryId = 0;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const formatAnswer = (value: string | string[]): string =>
  Array.isArray(value) ? value.join(", ") : value;

const FOOTER_WORDS: { text: string; tone: "wine" | "violet" | "magenta" | "white" | "gold" }[] = [
  { text: "LEARN", tone: "wine" },
  { text: "EXPLORE", tone: "violet" },
  { text: "ASPIRE", tone: "magenta" },
  { text: "DISCOVER", tone: "white" },
  { text: "UPN", tone: "gold" },
];

type Theme = "dark" | "light";

export default function MentorExperience() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [chipSelection, setChipSelection] = useState<string[]>([]);
  const [thinking, setThinking] = useState(false);
  const [result, setResult] = useState<RutaSugerida | null>(null);
  const [resultOpen, setResultOpen] = useState(false);
  const [userData, setUserData] = useState<UserData>(emptyUserData());
  const [speaking, setSpeaking] = useState(false);
  const [welcome, setWelcome] = useState(true);

  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.getAttribute("data-theme") === "light"
        ? "light"
        : "dark";
    }
    return "dark";
  });

  const toggleTheme = () => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem("lead-guia-theme", next);
      } catch {
        /* noop */
      }
      return next;
    });
  };

  const scrollRef = useRef<HTMLDivElement>(null);
  const runningRef = useRef(false);
  const pendingResolve = useRef<((v: string | string[]) => void) | null>(null);
  const typeResolvers = useRef(new Map<number, () => void>());

  const pushMentor = (text: string) =>
    new Promise<void>((resolve) => {
      const id = ++entryId;
      typeResolvers.current.set(id, resolve);
      setEntries((prev) => [...prev, { kind: "mentor", text, id }]);
    });

  const pushUser = (text: string) =>
    setEntries((prev) => [...prev, { kind: "user", text, id: ++entryId }]);

  const waitForAnswer = (index: number) =>
    new Promise<string | string[]>((resolve) => {
      pendingResolve.current = resolve;
      setActiveStep(index);
    });

  const submitAnswer = (value: string | string[]) => {
    const resolve = pendingResolve.current;
    pendingResolve.current = null;
    setActiveStep(null);
    resolve?.(value);
  };

  const resetConversation = () => {
    entryId = 0;
    pendingResolve.current = null;
    typeResolvers.current.clear();
    setEntries([]);
    setActiveStep(null);
    setChipSelection([]);
    setThinking(false);
    setResult(null);
    setResultOpen(false);
    setUserData(emptyUserData());
  };

  const restart = () => {
    runningRef.current = false;
    void run();
  };

  const handleStart = () => {
    setWelcome(false);
    void run();
  };

  const run = async () => {
    if (runningRef.current) return;
    runningRef.current = true;
    resetConversation();
    setThinking(false);
    await wait(450);

    setSpeaking(true);
    await pushMentor(`¡Hola! 👋 Soy Guía, tu mentor IA de ${ORG_NAME}.`);
    await wait(320);
    await pushMentor(
      "Voy a hacerte unas preguntas para conocerte y descubrir cuál de los pilares de LEAD es para ti. Vamos paso a paso.",
    );
    await wait(200);
    setSpeaking(false);

    const data: UserData = emptyUserData();

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const question =
        step.id === "motivacion" && data.nombre
          ? `Última pregunta, ${data.nombre}… ¿qué te motiva a lograrlo?`
          : step.question;
      setSpeaking(true);
      await pushMentor(question);
      setSpeaking(false);
      const answer = await waitForAnswer(i);
      (data as unknown as Record<string, string | string[]>)[step.field] = answer;
      setUserData({ ...data });
      pushUser(formatAnswer(answer));
      if (step.id === "nombre" && typeof answer === "string" && answer.trim()) {
        setSpeaking(true);
        await pushMentor(`¡Un gusto conocerte, ${answer.trim()}! Desde aquí vamos paso a paso.`);
        setSpeaking(false);
      }
      await wait(140);
    }

    setSpeaking(true);
    await pushMentor("¡Gracias! Déjame analizar todo lo que me contaste…");
    setSpeaking(false);

    setThinking(true);
    await wait(1600);
    const ruta = await new MockMentor().getRecommendation(data);
    setThinking(false);
    setResult(ruta);

    setSpeaking(true);
    await pushMentor(`¡Listo, ${ruta.nombre}!`);
    await pushMentor(
      "Este es tu perfil y el pilar que conecta contigo. ¿Listo para conocerlo en la charla del Discover Day?",
    );
    setSpeaking(false);

    setResultOpen(true);
    runningRef.current = false;
  };

  useEffect(() => {
    setChipSelection([]);
  }, [activeStep]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [entries, thinking, result]);

  useEffect(() => {
    if (!resultOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setResultOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [resultOpen]);

  const handleTypedDone = (id: number) => {
    const resolve = typeResolvers.current.get(id);
    if (resolve) {
      typeResolvers.current.delete(id);
      resolve();
    }
  };

  const step = activeStep !== null ? steps[activeStep] : null;

  const toggleChip = (label: string, single: boolean) => {
    if (single) {
      submitAnswer(label);
      return;
    }
    setChipSelection((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label],
    );
  };

  const handleTextSubmit = (text: string) => {
    const value = text.trim();
    if (!value) return;
    submitAnswer(value);
  };

  const inputArea =
    step && activeStep !== null ? (
      <motion.div
        className={styles.inputArea}
        key={step.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div className={styles.inputHint}>{step.prompt}</div>

        {step.type === "text" && <TextField onSubmit={handleTextSubmit} />}

        {step.type === "multi-select" && (
          <>
            <div className={styles.chips}>
              {step.options.map((opt) => (
                <Chip
                  key={opt}
                  label={opt}
                  selected={chipSelection.includes(opt)}
                  onClick={() => toggleChip(opt, false)}
                />
              ))}
            </div>
            <div className={styles.inputActions}>
              <Button disabled={chipSelection.length === 0} onClick={() => submitAnswer(chipSelection)}>
                Continuar
              </Button>
            </div>
          </>
        )}

        {step.type === "single-select" && (
          <div className={styles.chips}>
            {step.options.map((opt) => (
              <Chip key={opt} label={opt} onClick={() => toggleChip(opt, true)} />
            ))}
          </div>
        )}
      </motion.div>
    ) : null;

  return (
    <div className={styles.experience}>
      <Starfield density={90} />

      <header className={styles.header}>
        <a
          href="https://leadupn.page/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.leadLogo}
          title={ORG_NAME}
        >
          <Image
            src="/assets/logo-lead.webp"
            alt={ORG_NAME}
            width={102}
            height={102}
            unoptimized
            className={styles.leadLogoImg}
          />
        </a>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </header>

      {welcome ? (
        <WelcomeScreen onStart={handleStart} />
      ) : (
        <>
          <div className={styles.orbZone}>
            <GuiaMascot
              state={thinking ? "thinking" : speaking ? "speaking" : "idle"}
              size={170}
            />
            <div className={styles.orbLabel}>Guía</div>
          </div>

          <main className={styles.main}>
            <div className={styles.scroll} ref={scrollRef} aria-live="polite">
              <div className={styles.chat}>
                {entries.map((entry) => {
                  if (entry.kind === "mentor") {
                    return (
                      <motion.div
                        key={entry.id}
                        className={styles.bubbleMentor}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        <GuiaMascot state="idle" size={34} mode="avatar" className={styles.avatar} />
                        <div className={styles.bubbleMentorBody}>
                          <Typewriter text={entry.text} onDone={() => handleTypedDone(entry.id)} />
                        </div>
                      </motion.div>
                    );
                  }
                  if (entry.kind === "user") {
                    return (
                      <motion.div
                        key={entry.id}
                        className={styles.bubbleUser}
                        initial={{ opacity: 0, y: 10, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        {entry.text}
                      </motion.div>
                    );
                  }
                  return null;
                })}

                {thinking && (
                  <motion.div
                    className={styles.thinking}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                    <span className={styles.thinkingText}>LEAD-GUÍA está analizando tu perfil…</span>
                  </motion.div>
                )}

                {inputArea}

                <div className={styles.scrollSpacer} />
              </div>
            </div>
          </main>
        </>
      )}

      <footer className={styles.footer}>
        <div className={styles.marquee} aria-hidden="true">
          <div className={styles.marqueeTrack}>
            {[0, 1].map((half) => (
              <div className={styles.marqueeGroup} key={half}>
                {[...FOOTER_WORDS, ...FOOTER_WORDS, ...FOOTER_WORDS, ...FOOTER_WORDS].map(
                  (word, i) => (
                    <span
                      key={`${half}-${i}`}
                      className={`${styles.marqueeItem} ${styles[`tone-${word.tone}`]}`}
                    >
                      {word.text}
                      <span className={styles.marqueeSep} aria-hidden="true">
                        ✦
                      </span>
                    </span>
                  ),
                )}
              </div>
            ))}
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {result && !resultOpen && (
          <motion.button
            type="button"
            className={styles.reopenButton}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setResultOpen(true)}
          >
            <GuiaMascot state="greeting" size={44} mode="avatar" />
            <span className={styles.reopenText}>Ver mi ruta</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {resultOpen && result && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setResultOpen(false)}
          >
            <motion.div
              className={styles.modalWrap}
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Tu ruta sugerida"
            >
              <ResultCard
                result={result}
                userData={userData}
                onClose={() => setResultOpen(false)}
                onRestart={restart}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ------------------------------------------------------------

function TextField({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [value, setValue] = useState("");

  const submit = () => {
    if (!value.trim()) return;
    onSubmit(value);
    setValue("");
  };

  return (
    <div className={styles.textField}>
      <input
        className={styles.textInput}
        type="text"
        value={value}
        placeholder="Escribe aquí…"
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
        autoFocus
        autoComplete="off"
      />
      <Button disabled={!value.trim()} onClick={submit}>
        Enviar
      </Button>
    </div>
  );
}

function ResultCard({
  result,
  userData,
  onClose,
  onRestart,
}: {
  result: RutaSugerida;
  userData: UserData;
  onClose: () => void;
  onRestart: () => void;
}) {
  const { pilar, tagline, descripcion, ruta, acciones, perfil, color, nombre } = result;

  return (
    <GlowCard glow={color} className={styles.modalCard}>
      <div className={styles.modalBanner}>
              <GuiaMascot state="greeting" size={56} mode="avatar" className={styles.modalBannerOrb} />
        <div className={styles.modalBannerText}>
          <span className={styles.modalBannerKicker}>TU RUTA SUGERIDA</span>
          <h2 className={styles.modalBannerTitle}>{pilar}</h2>
          <span className={styles.modalBannerTagline}>{tagline}</span>
        </div>
        <button
          type="button"
          className={styles.modalClose}
          onClick={onClose}
          aria-label="Cerrar"
        >
          ✕
        </button>
      </div>

      <div className={styles.modalBody}>
        <div className={styles.modalGreet}>
          <p>{perfil}</p>
          <p className={styles.modalGreetDesc}>{descripcion}</p>
        </div>

        <div className={styles.modalRuta}>
          <span className={styles.modalLabel}>Ruta recomendada</span>
          <div className={styles.modalRutaValue}>
            {ruta}
          </div>
        </div>

        <div className={styles.modalPasos}>
          <span className={styles.modalLabel}>Primeros pasos</span>
          <ol>
            {acciones.map((accion, i) => (
              <li key={accion}>
                <span className={styles.modalPasoNum}>
                  {i + 1}
                </span>
                {accion}
              </li>
            ))}
          </ol>
        </div>

        <div className={styles.modalRecap}>
          <span className={styles.modalLabel}>Tu perfil</span>
          <div className={styles.modalChips}>
            <Chip label={nombre} accent={color} />
            {userData.cursos_preferidos.slice(0, 2).map((c) => (
              <Chip key={c} label={c} accent={color} />
            ))}
            <Chip label={userData.habilidad_a_desarrollar || "Habilidad en desarrollo"} accent={color} />
            {userData.hobbies.slice(0, 2).map((h) => (
              <Chip key={h} label={h} accent={color} />
            ))}
            <Chip label={`“${userData.motivacion}”`} accent={color} />
          </div>
        </div>

        <div className={styles.modalActions}>
          <Button onClick={onRestart}>Reiniciar conversación</Button>
          <a
            href="https://leadupn.page/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.linkButton}
          >
            Conocer LEAD UPN ↗
          </a>
        </div>
      </div>
    </GlowCard>
  );
}
