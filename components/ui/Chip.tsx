"use client";

import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import styles from "./Chip.module.scss";

interface ChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  accent?: string;
}

export default function Chip({ label, selected = false, onClick, disabled, accent }: ChipProps) {
  return (
    <motion.button
      type="button"
      className={`${styles.chip} ${selected ? styles.selected : ""}`}
      onClick={onClick}
      disabled={disabled}
      style={
        (selected && accent
          ? ({ "--chip-accent": accent } as CSSProperties)
          : undefined)
      }
      whileTap={{ scale: 0.94 }}
      whileHover={disabled ? undefined : { scale: 1.04 }}
    >
      {selected && <span className={styles.check} aria-hidden="true">✓</span>}
      {label}
    </motion.button>
  );
}
