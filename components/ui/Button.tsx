"use client";

import type { HTMLMotionProps } from "framer-motion";
import { motion } from "framer-motion";
import styles from "./Button.module.scss";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "ghost";
}

export default function Button({ variant = "primary", className, children, ...rest }: ButtonProps) {
  return (
    <motion.button
      type="button"
      className={`${styles.button} ${styles[variant]} ${className ?? ""}`}
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.97 }}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
