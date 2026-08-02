"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import GuiaMascot from "./ui/GuiaMascot";
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
        <motion.div variants={item} className={styles.content}>
          <div className={styles.top}>
            <a
              href="https://leadupn.page/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.brand}
              title={ORG_NAME}
            >
              <Image
                src="https://res.cloudinary.com/dpnxbnqxu/image/upload/v1785680406/logo-lead_p1ymto.webp"
                alt={ORG_NAME}
                width={56}
                height={56}
                unoptimized
                className={styles.brandImg}
              />
              <span className={styles.brandText}>
                <span className={styles.brandName}>{ORG_NAME}</span>
                <span className={styles.brandTag}>DISCOVER DAY</span>
              </span>
            </a>
            <div className={styles.badge}>
              <span className={styles.badgeDot} />
              EXPERIENCIA INTERACTIVA
            </div>
          </div>

          <h1 className={styles.title}>
            Descubre qué tipo de <em>líder</em> puedes ser
          </h1>

          <p className={styles.desc}>
            Conversa con nuestra IA y descubre cuál de los pilares de {ORG_NAME}{" "}
            es para ti.
          </p>

          <div className={styles.meta}>
            <span>Toma menos de 2 minutos</span>
            <span className={styles.metaSep} />
            <span>Encuentra tu pilar</span>
          </div>

          <div className={styles.actions}>
            <Button onClick={onStart} size="lg" className={styles.startBtn}>
              Comenzar ahora
            </Button>
            <p className={styles.footnote}>Una charla, cinco pilares y un nuevo comienzo.</p>
          </div>
        </motion.div>

        <motion.div variants={item} className={styles.panel}>
          <div className={styles.halo} aria-hidden="true" />
          <div className={styles.rings} aria-hidden="true">
            <div className={`${styles.ring} ${styles.ringOuter}`} />
            <div className={`${styles.ring} ${styles.ringInner}`} />
          </div>
          <div className={styles.orb}>
            <GuiaMascot state="greeting" size={300} />
          </div>
          <div className={styles.sparkles} aria-hidden="true">
            <span className={styles.sparkle} />
            <span className={styles.sparkle} />
            <span className={styles.sparkle} />
            <span className={styles.sparkle} />
            <span className={styles.sparkle} />
            <span className={styles.sparkle} />
            <span className={styles.sparkle} />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
