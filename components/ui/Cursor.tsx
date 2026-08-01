"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Cursor.module.scss";

const INTERACTIVE_SELECTOR =
  "a, button, input, select, textarea, label, [role='button'], [data-cursor]";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const shownRef = useRef(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;

      if (!shownRef.current) {
        shownRef.current = true;
        setVisible(true);
      }

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${tx}px, ${ty}px, 0) translate(-50%, -50%)`;
      }

      const target = e.target as HTMLElement | null;
      const interactive = Boolean(target?.closest?.(INTERACTIVE_SELECTOR));
      setHovering(interactive);
    };

    const loop = () => {
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className={`${styles.cursor} ${visible ? styles.visible : ""}`}
      aria-hidden="true"
    >
      <div ref={dotRef} className={styles.dot} />
      <div ref={ringRef} className={styles.ringPos}>
        <div className={`${styles.ring} ${hovering ? styles.ringHover : ""}`} />
      </div>
    </div>
  );
}
