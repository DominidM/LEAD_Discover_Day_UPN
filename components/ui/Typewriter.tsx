"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Typewriter.module.scss";

interface TypewriterProps {
  text: string;
  speed?: number;
  onDone?: () => void;
  className?: string;
}

export default function Typewriter({ text, speed = 22, onDone, className }: TypewriterProps) {
  const [count, setCount] = useState(0);
  const doneRef = useRef(false);

  useEffect(() => {
    if (count >= text.length) {
      if (!doneRef.current) {
        doneRef.current = true;
        onDone?.();
      }
      return;
    }
    const t = setTimeout(() => setCount((c) => c + 1), speed);
    return () => clearTimeout(t);
  }, [count, text, speed, onDone]);

  useEffect(() => {
    doneRef.current = false;
    setCount(0);
  }, [text]);

  return (
    <span className={className}>
      {text.slice(0, count)}
      {count < text.length && <span className={styles.cursor} aria-hidden="true" />}
    </span>
  );
}
