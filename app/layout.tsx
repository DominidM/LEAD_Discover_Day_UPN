import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, Instrument_Serif, Poppins } from "next/font/google";
import Cursor from "@/components/ui/Cursor";
import "./globals.scss";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LEAD-GUÍA · Mentor IA de LEAD UPN",
  description:
    "LEAD-GUÍA es el mentor IA de LEAD UPN. Responde unas preguntas y descubre tu pilar y tu ruta dentro del ecosistema LEAD.",
  keywords: [
    "LEAD UPN",
    "mentor IA",
    "orientación vocacional",
    "universidad privada del norte",
    "liderazgo",
    "STEM",
  ],
};

export const viewport: Viewport = {
  themeColor: "#010723",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("lead-guia-theme");if(t==="light"){document.documentElement.setAttribute("data-theme","light");}}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${spaceGrotesk.variable} ${inter.variable} ${instrumentSerif.variable} ${poppins.variable}`}>
        <div className="app-backdrop" aria-hidden="true" />
        <div className="app-grain" aria-hidden="true" />
        <Cursor />
        {children}
      </body>
    </html>
  );
}
