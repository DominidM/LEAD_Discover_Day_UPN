"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Orb from "./ui/Orb";
import Starfield from "./ui/Starfield";
import Typewriter from "./ui/Typewriter";
import Chip from "./ui/Chip";
import Button from "./ui/Button";
import GlowCard from "./ui/GlowCard";
import { steps } from "@/lib/mock-data";
import { emptyUserData, type RutaSugerida, type UserData } from "@/lib/ai/mentor";
import { MockMentor } from "@/lib/ai/mock-mentor";
import { BRAND_NAME, ORG_NAME } from "@/lib/constants";
import styles from "./MentorExperience.module.scss";

type Entry =
  | { kind: "mentor"; text: string; id: number }
  | { kind: "user"; text: string; id: number }
  | { kind: "result" };

let entryId = 0;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const formatAnswer = (value: string | string[]): string =>
  Array.isArray(value) ? value.join(", ") : value;

export default function MentorExperience() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [chipSelection, setChipSelection] = useState<string[]>([]);
  const [thinking, setThinking] = useState(false);
  const [result, setResult] = useState<RutaSugerida | null>(null);
  const [userData, setUserData] = useState<UserData>(emptyUserData());
  const [speaking, setSpeaking] = useState(false);

  const [mouse, setMouse] = useState({ x: -200, y: -200 });

  const scrollRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
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
    setUserData(emptyUserData());
  };

  const restart = () => {
    runningRef.current = false;
    void run();
  };

  const run = async () => {
    if (runningRef.current) return;
    runningRef.current = true;
    resetConversation();
    setThinking(false);
    await wait(450);

    setSpeaking(true);
    await pushMentor(`¡Hola! 👋 Soy ${BRAND_NAME}, tu mentor IA de ${ORG_NAME}.`);
    await wait(320);
    await pushMentor(
      "Voy a hacerte unas preguntas para conocerte y descubrir juntos tu rumbo dentro del ecosistema LEAD. Vamos paso a paso.",
    );
    await wait(200);
    setSpeaking(false);

    const data: UserData = emptyUserData();

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      setSpeaking(true);
      await pushMentor(step.question);
      setSpeaking(false);
      const answer = await waitForAnswer(i);
      (data as unknown as Record<string, string | string[]>)[step.field] = answer;
      setUserData({ ...data });
      pushUser(formatAnswer(answer));
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
    setEntries((prev) => [...prev, { kind: "result" }]);
    await wait(200);

    setSpeaking(true);
    await pushMentor(`¡Listo, ${ruta.nombre}!`);
    await pushMentor(
      "Este es tu perfil y la ruta que te recomiendo dentro del ecosistema LEAD. ¿Listo para dar el primer paso?",
    );
    setSpeaking(false);

    runningRef.current = false;
  };

  const runRef = useRef(run);
  runRef.current = run;

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    void runRef.current();
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    setChipSelection([]);
  }, [activeStep]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [entries, thinking, result]);

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

      <div
        className={styles.cursorGlow}
        style={{ transform: `translate3d(${mouse.x}px, ${mouse.y}px, 0)` }}
        aria-hidden="true"
      />

      <header className={styles.header}>
        <div className={styles.brand}>
          <Image src="/orb.svg" alt="" width={34} height={34} className={styles.brandMark} unoptimized />
          <span className={styles.wordmark}>
            <span className={styles.wordmarkLead}>LEAD</span>
            <span className={styles.wordmarkGuia}>-GUÍA</span>
          </span>
        </div>
        <span className={styles.badge}>{ORG_NAME}</span>
      </header>

      <div className={styles.orbZone}>
        <Orb thinking={thinking} speaking={speaking} size={150} />
        <div className={styles.orbLabel}>{BRAND_NAME}</div>
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
                    <Image src="/orb.svg" alt="" width={26} height={26} className={styles.avatar} unoptimized />
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
              if (entry.kind === "result" && result) {
                return (
                  <ResultCard key="result" result={result} userData={userData} onRestart={restart} />
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

      <footer className={styles.footer}>
        {BRAND_NAME} · Mentor IA de {ORG_NAME} — Descubre tu rumbo.
      </footer>
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
  onRestart,
}: {
  result: RutaSugerida;
  userData: UserData;
  onRestart: () => void;
}) {
  const { pilar, tagline, descripcion, ruta, acciones, perfil, color, nombre } = result;

  return (
    <motion.div initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5, ease: "easeOut" }}>
      <GlowCard glow={color}>
        <div className={styles.result}>
          <div className={styles.resultHeader}>
            <span className={styles.resultKicker}>TU RUTA SUGERIDA</span>
            <span className={styles.resultPilarTag} style={{ "--tag": color } as CSSProperties}>
              Pilar · {pilar}
            </span>
          </div>

          <h2 className={styles.resultTitle}>
            {pilar}{" "}
            <span className={styles.resultTagline} style={{ color }}>
              · {tagline}
            </span>
          </h2>

          <p className={styles.resultPerfil}>{perfil}</p>

          <p className={styles.resultDesc}>{descripcion}</p>

          <div className={styles.resultRuta}>
            <span className={styles.resultRutaLabel}>Ruta recomendada</span>
            <span className={styles.resultRutaValue}>{ruta}</span>
          </div>

          <div className={styles.resultAcciones}>
            <span className={styles.resultRutaLabel}>Primeros pasos</span>
            <ul>
              {acciones.map((accion) => (
                <li key={accion}>
                  <span className={styles.resultCheck} aria-hidden="true">✦</span>
                  {accion}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.resultRecap}>
            <span className={styles.resultRutaLabel}>Tu perfil</span>
            <div className={styles.resultRecapChips}>
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

          <div className={styles.resultActions}>
            <Button onClick={onRestart}>Reiniciar conversación</Button>
            <Button variant="ghost" onClick={onRestart}>
              Conocer LEAD UPN
            </Button>
          </div>
        </div>
      </GlowCard>
    </motion.div>
  );
}
