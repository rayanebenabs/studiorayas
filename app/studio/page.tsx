import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Contact } from "@/components/Contact";
import { Reveal } from "@/components/Reveal";
import { BRAND_LINE, WHY_US } from "@/content/site";
import { CAMP, FOR_WHO, OFFER_DETAIL, STUDIO } from "@/content/studio";

export const metadata: Metadata = {
  title: "Studio · Studio Rayas",
  description:
    "Studio Rayas est un studio de marque, fondé par Rayane Benabdeljalil. Stratégie et identité sortent de la même main, et la marque est livrée en règles : le Brand OS.",
};

const num = (i: number) => String(i + 1).padStart(2, "0");

export default function StudioPage() {
  return (
    <main className="page">
      <SiteHeader />

      <header className="page-hero container">
        <p className="sr-eyebrow">{STUDIO.eyebrow}</p>
        <h1 className="title-xl">{STUDIO.title}</h1>
        <p className="lead">{STUDIO.intro}</p>
        <p className="studio-line">{BRAND_LINE}</p>
      </header>

      <Reveal as="section" className="section section--encre">
        <div className="container">
          <p className="sr-eyebrow" data-reveal>{CAMP.eyebrow}</p>
          <h2 className="title-lg page-h2" data-reveal>{CAMP.title}</h2>
          <p className="title-md studio-camp" data-reveal>{CAMP.text}</p>
          <div className="grid-3 page-gap">
            {CAMP.against.map((a) => (
              <div key={a.title} className="point" data-reveal>
                <h3 className="point__title" style={{ marginTop: 0 }}>{a.title}</h3>
                <p className="point__text">{a.text}</p>
              </div>
            ))}
            <div className="point" data-reveal>
              <h3 className="point__title" style={{ marginTop: 0 }}>{FOR_WHO.eyebrow}</h3>
              <p className="point__text">{FOR_WHO.text}</p>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="section">
        <div className="container studio-cols">
          <div>
            <p className="sr-eyebrow" data-reveal>L&apos;offre</p>
            <ul className="studio-list">
              {OFFER_DETAIL.map((o) => (
                <li key={o.name} data-reveal>
                  <strong>{o.name}</strong>
                  <span>{o.text}</span>
                </li>
              ))}
            </ul>
            <Link href="/methode/" className="steps__more" data-reveal>
              Le process, étape par étape
            </Link>
          </div>
          <div>
            <p className="sr-eyebrow" data-reveal>Pourquoi nous</p>
            <ul className="studio-list">
              {WHY_US.map((w, i) => (
                <li key={w} data-reveal>
                  <strong>{num(i)}</strong>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>

      <Contact />
      <SiteFooter />
    </main>
  );
}
