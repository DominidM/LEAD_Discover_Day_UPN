"use client";

import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import styles from "./Orb.module.scss";

interface OrbProps {
  thinking?: boolean;
  speaking?: boolean;
  size?: number;
  className?: string;
}

export default function Orb({ thinking = false, speaking = false, size = 180, className }: OrbProps) {
  return (
    <div
      className={`${styles.orb} ${className ?? ""}`}
      style={{ "--orb-size": `${size}px` } as CSSProperties}
      aria-hidden="true"
    >
      <div className={styles.halo} />
      <motion.div
        className={styles.core}
        animate={{ scale: thinking ? [1, 1.16, 1] : [1, 1.045, 1] }}
        transition={{
          duration: thinking ? 0.7 : 2.6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <div className={styles.ring} />
      <div className={styles.ringReverse} />
      {speaking && (
        <>
          <span className={styles.wave} />
          <span className={styles.wave} />
          <span className={styles.wave} />
        </>
      )}
    </div>
  );
}
