"use client";

import { useMemo } from "react";
import Image from "next/image";
import styles from "./GuiaMascot.module.scss";

type State = "idle" | "speaking" | "thinking" | "greeting";

interface GuiaMascotProps {
  state?: State;
  size?: number;
  mode?: "full" | "avatar";
  className?: string;
}

const IMAGES: Record<State, string> = {
  idle: "https://res.cloudinary.com/dpnxbnqxu/image/upload/v1785686641/reposo_mzz6xb.png",
  speaking: "https://res.cloudinary.com/dpnxbnqxu/image/upload/v1785686619/hablando_bc1kz8.png",
  thinking: "https://res.cloudinary.com/dpnxbnqxu/image/upload/v1785686620/pensando_iz9zyw.png",
  greeting: "https://res.cloudinary.com/dpnxbnqxu/image/upload/v1785686642/saludo_gsc1n9.png",
};

export default function GuiaMascot({
  state = "idle",
  size = 150,
  mode = "full",
  className = "",
}: GuiaMascotProps) {
  const isAvatar = mode === "avatar";

  const images = useMemo(
    () => (isAvatar ? [IMAGES[state]] : Object.values(IMAGES)),
    [isAvatar, state],
  );

  return (
    <div
      className={`${styles.wrap} ${styles[state]} ${isAvatar ? styles.avatar : ""} ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {images.map((src) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          unoptimized
          priority
          sizes={`${size}px`}
          className={`${styles.image} ${src === IMAGES[state] ? styles.active : ""}`}
          style={{
            objectFit: isAvatar ? "cover" : "contain",
            objectPosition: isAvatar ? "top center" : "center",
          }}
        />
      ))}
    </div>
  );
}
