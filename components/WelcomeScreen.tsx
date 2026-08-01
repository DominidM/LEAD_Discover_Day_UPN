"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Orb from "./ui/Orb";
import Button from "./ui/Button";
import { ORG_NAME } from "@/lib/constants";
import styles from "./WelcomeScreen.module.scss";

interface WelcomeScreenProps {
  onStart: () => void;
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className={styles.wrap}>
      <motion.div
        className={styles.inner}
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item} className={styles.top}>
          <a
            href="https://leadupn.page/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.brand}
            title={ORG_NAME}
          >
            <Image
              src="/assets/logo-lead.webp"
              alt={ORG_NAME}
              width={40}
              height={40}
              unoptimized
              className={styles.brandImg}
            />
            <span className={styles.brandName}>{ORG_NAME}</span>
            <span className={styles.brandTag}>DISCOVER DAY</span>
          </a>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            EXPERIENCIA INTERACTIVA
          </div>
        </motion.div>

        <motion.div variants={item} className={styles.orb}>
          <Orb thinking={false} speaking={false} size={112} />
        </motion.div>

        <motion.h1 variants={item} className={styles.title}>
          Descubre qué tipo de <em>líder</em> puedes ser
        </motion.h1>

        <motion.p variants={item} className={styles.desc}>
          Conversa con nuestra IA y descubre las experiencias de {ORG_NAME}{" "}
          ideales para ti.
        </motion.p>

        <motion.div variants={item} className={styles.meta}>
          <span>Toma menos de 2 minutos</span>
          <span className={styles.metaSep} />
          <span>Encuentra tu próximo reto</span>
        </motion.div>

        <motion.div variants={item} className={styles.actions}>
          <Button onClick={onStart} size="lg">
            Comenzar ahora
          </Button>
          <p className={styles.footnote}>Tu próximo gran equipo puede empezar aquí.</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
