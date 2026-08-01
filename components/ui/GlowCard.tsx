"use client";

import type { CSSProperties, ReactNode } from "react";
import styles from "./GlowCard.module.scss";

interface GlowCardProps {
  children: ReactNode;
  glow?: string;
  className?: string;
}

export default function GlowCard({ children, glow = "#ffb819", className }: GlowCardProps) {
  return (
    <div className={`${styles.card} ${className ?? ""}`} style={{ "--card-glow": glow } as CSSProperties}>
      {children}
    </div>
  );
}
