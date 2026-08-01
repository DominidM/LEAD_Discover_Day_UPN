"use client";

import { useEffect, useRef } from "react";
import styles from "./Starfield.module.scss";

interface StarfieldProps {
  density?: number;
}

interface Star {
  x: number;
  y: number;
  r: number;
  tw: number;
  speed: number;
}

export default function Starfield({ density = 70 }: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let isLight =
      document.documentElement.getAttribute("data-theme") === "light";

    const observer = new MutationObserver(() => {
      isLight =
        document.documentElement.getAttribute("data-theme") === "light";
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const stars: Star[] = Array.from({ length: density }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.3 + 0.25,
      tw: Math.random() * Math.PI * 2,
      speed: 0.015 + Math.random() * 0.05,
    }));

    const resize = () => {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        s.tw += 0.01;
        if (!reduce) {
          s.y += s.speed * 0.001;
          if (s.y > 1) s.y = 0;
        }
        const alpha = 0.25 + 0.4 * Math.sin(s.tw);
        ctx.beginPath();
        ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r * devicePixelRatio, 0, Math.PI * 2);
        ctx.fillStyle = isLight
          ? `rgba(2, 12, 65, ${alpha})`
          : `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [density]);

  return <canvas ref={canvasRef} className={styles.starfield} aria-hidden="true" />;
}
