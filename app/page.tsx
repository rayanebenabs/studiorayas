import { Hero } from "@/components/home/Hero";
import { WhyNow } from "@/components/home/WhyNow";
import { Manifesto } from "@/components/home/Manifesto";
import { Steps } from "@/components/home/Steps";
import { Usages } from "@/components/home/Usages";
import { Benefits } from "@/components/home/Benefits";
import { Work } from "@/components/home/Work";
import { GalleryTeaser } from "@/components/home/GalleryTeaser";
import { Owned } from "@/components/home/Owned";
import { Contact } from "@/components/home/Contact";
import { SiteFooter } from "@/components/SiteFooter";
import { SectionStops } from "@/components/SectionStops";

export default function Home() {
  return (
    <main>
      <Hero />
      <WhyNow />
      <Manifesto />
      <Steps />
      <Usages />
      <Benefits />
      <Work />
      <GalleryTeaser />
      <Owned />
      <Contact />
      <SiteFooter />
      <SectionStops />
    </main>
  );
}
