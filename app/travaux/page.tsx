import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Contact } from "@/components/Contact";
import { Work } from "@/components/home/Work";
import { GalleryTeaser } from "@/components/home/GalleryTeaser";

export const metadata: Metadata = {
  title: "Travaux · Studio Rayas",
  description: "Les marques construites par Studio Rayas : branding, charte et Brand OS. Sur chaque cas, un brand-check à jouer.",
};

export default function TravauxPage() {
  return (
    <main className="page">
      <SiteHeader />
      <Work page />
      <GalleryTeaser />
      <Contact />
      <SiteFooter />
    </main>
  );
}
