import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "@fontsource/cormorant-garamond/300.css";
import "@fontsource/cormorant-garamond/300-italic.css";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/archivo/400.css";
import "@fontsource/archivo/500.css";
import "@fontsource/archivo/600.css";
import "lenis/dist/lenis.css";
import "../brand/build/tokens.css";
import "../brand/build/brand.css";
import "./globals.css";
import { tokens } from "@/brand/build/tokens.js";

export const metadata: Metadata = {
  title: "Studio Rayas · studio de marque",
  description:
    "On rend l'artistique technique. Studio Rayas écrit votre marque en règles, le Brand OS, pour qu'un humain ou un agent l'applique sans nous.",
};

export const viewport: Viewport = {
  themeColor: tokens.light.color.palette.craie,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="sr-root">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
