import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { VisualEditsMessenger } from "orchids-visual-edits";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "GNOSIS - Base de Connaissances Avancée",
  description: "Explorez 30 sujets de connaissance avancée couvrant la science, la technologie, la philosophie et la finance. Cartes interactives 3D avec contenu approfondi.",
  keywords: ["connaissances", "science", "technologie", "philosophie", "crypto", "blockchain", "IA", "physique"],
  authors: [{ name: "GNOSIS" }],
  openGraph: {
    title: "GNOSIS - Base de Connaissances Avancée",
    description: "Explorez 30 sujets de connaissance avancée avec des cartes interactives 3D",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "GNOSIS - Base de Connaissances Avancée",
    description: "Explorez 30 sujets de connaissance avancée avec des cartes interactives 3D",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
        <VisualEditsMessenger />
      </body>
    </html>
  );
}
