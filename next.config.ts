import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  output: "export",
  distDir: isDev ? ".next-dev" : ".next",
  images: {
    unoptimized: true,
  },
  // En desarrollo, /api/mentor y /api/email no existen en el servidor de
  // Next (son Cloudflare Pages Functions). Los proxeamos a la instancia local
  // de wrangler para poder probarlas con `npm run dev`. En producción (build
  // estático) las sirve la Pages Function y no aplica el rewrite.
  ...(isDev
    ? {
        async rewrites() {
          const proxy = () =>
            process.env.PAGES_PROXY || "http://localhost:8788";
          return [
            { source: "/api/mentor", destination: `${proxy()}/api/mentor` },
            { source: "/api/email", destination: `${proxy()}/api/email` },
          ];
        },
      }
    : {}),
};

export default nextConfig;