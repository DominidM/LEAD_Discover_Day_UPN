import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  output: "export",
  distDir: isDev ? ".next-dev" : ".next",
  images: {
    unoptimized: true,
  },
  // En desarrollo, /api/mentor no existe en el servidor de Next (es una
  // Cloudflare Pages Function). Lo proxeamos a la instancia local de wrangler
  // para poder probar la IA con `npm run dev`. En producción (build estático)
  // la ruta /api/mentor la sirve la Pages Function y no aplica el rewrite.
  ...(isDev
    ? {
        async rewrites() {
          return [
            {
              source: "/api/mentor",
              destination: process.env.AI_PROXY || "http://localhost:8788/api/mentor",
            },
          ];
        },
      }
    : {}),
};

export default nextConfig;