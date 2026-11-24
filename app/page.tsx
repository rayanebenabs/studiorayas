import { Hero } from "@/components/home/Hero";
import { WhyNow } from "@/components/home/WhyNow";
import { Manifesto } from "@/components/home/Manifesto";
import { Steps } from "@/components/home/Steps";
import { Work } from "@/components/home/Work";
import { Contact } from "@/components/Contact";
import { SiteFooter } from "@/components/SiteFooter";
import { ScrollFlow } from "@/components/ScrollFlow";

// L'accueil résume, les pages détaillent : Méthode, Travaux, Studio, Galerie.
export default function Home() {
  return (
    <main>
      <Hero />
      <WhyNow />
      <Manifesto />
      <Steps />
      <Work />
      <Contact />
      <SiteFooter />
      <ScrollFlow />
    </main>
  );
}
