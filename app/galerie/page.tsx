import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Gallery } from "@/components/gallery/Gallery";

export const metadata: Metadata = {
  title: "Galerie · Studio Rayas",
  description: "Les travaux personnels de Rayane Benabdeljalil, accrochés dans une salle en 3D que vous parcourez comme dans un jeu.",
};

export default function GaleriePage() {
  return (
    <main>
      <SiteHeader />
      <Gallery />
      <SiteFooter />
    </main>
  );
}
