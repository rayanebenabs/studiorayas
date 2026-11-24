import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Contact } from "@/components/Contact";
import { Usages } from "@/components/home/Usages";
import { Benefits } from "@/components/home/Benefits";
import { Owned } from "@/components/home/Owned";
import { Reveal } from "@/components/Reveal";
import { BRAND_OS, ENGINEERING, METHODE, PROCESS } from "@/content/methode";

export const metadata: Metadata = {
  title: "Méthode · Studio Rayas",
  description:
    "Le brand engineering, le Brand OS et le process de Studio Rayas : du diagnostic à une marque écrite en règles, que vous faites évoluer seul.",
};

const num = (i: number) => String(i + 1).padStart(2, "0");

export default function MethodePage() {
  return (
    <main className="page">
      <SiteHeader />

      <header className="page-hero container">
        <p className="sr-eyebrow">{METHODE.eyebrow}</p>
        <h1 className="title-xl">{METHODE.title}</h1>
        <p className="lead">{METHODE.intro}</p>
        <nav className="methode-toc" aria-label="Sur cette page">
          <a href="#brand-engineering">Le brand engineering</a>
          <a href="#brand-os">Le Brand OS</a>
          <a href="#process">Le process</a>
        </nav>
      </header>

      {/* Le brand engineering */}
      <Reveal as="section" className="section page-section">
        <div className="container" id="brand-engineering">
          <p className="sr-eyebrow" data-reveal>{ENGINEERING.eyebrow}</p>
          <h2 className="title-lg page-h2" data-reveal>{ENGINEERING.title}</h2>
          <div className="methode-cols">
            <div className="page-prose" data-reveal>
              {ENGINEERING.text.map((t) => (
                <p key={t}>{t}</p>
              ))}
            </div>
            <dl className="methode-pairs" data-reveal>
              <div className="methode-pairs__head" aria-hidden="true">
                <span>Avant</span>
                <span>Écrit comme un système</span>
              </div>
              {ENGINEERING.pairs.map((p) => (
                <div key={p.yes} className="methode-pairs__row">
                  <dt>{p.not}</dt>
                  <dd>{p.yes}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="grid-3 page-gap">
            {ENGINEERING.principles.map((p, i) => (
              <div key={p.title} className="point" data-reveal>
                <p className="point__n">{num(i)}</p>
                <h3 className="point__title">{p.title}</h3>
                <p className="point__text">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Le Brand OS */}
      <Reveal as="section" className="section section--papier">
        <div className="container" id="brand-os">
          <p className="sr-eyebrow" data-reveal>{BRAND_OS.eyebrow}</p>
          <h2 className="title-lg page-h2" data-reveal>{BRAND_OS.title}</h2>
          <p className="lead page-lead" data-reveal>{BRAND_OS.intro}</p>

          <div className="methode-files" data-reveal>
            <p className="methode-files__root">brand-os/</p>
            <ul>
              {BRAND_OS.contents.map((c) => (
                <li key={c.name}>
                  <strong>{c.name}</strong>
                  <span>{c.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <h3 className="title-md page-h3" data-reveal>{BRAND_OS.where.title}</h3>
          <div className="grid-4 page-gap-sm">
            {BRAND_OS.where.items.map((w) => (
              <div key={w.name} className="point" data-reveal>
                <h4 className="point__title" style={{ marginTop: 0 }}>{w.name}</h4>
                <p className="point__text">{w.text}</p>
              </div>
            ))}
          </div>

          <h3 className="title-md page-h3" data-reveal>{BRAND_OS.levels.title}</h3>
          <p className="page-prose page-prose--narrow" data-reveal>{BRAND_OS.levels.intro}</p>
          <ol className="methode-levels" data-reveal>
            {BRAND_OS.levels.items.map((l) => (
              <li key={l.n}>
                <span className="methode-levels__n">Niveau {l.n}</span>
                <strong>{l.name}</strong>
                <span className="methode-levels__text">{l.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>

      {/* Le Brand OS, pour chacun */}
      <Usages />
      <Benefits />
      <Owned />

      {/* Le process */}
      <Reveal as="section" className="section">
        <div className="container" id="process">
          <p className="sr-eyebrow" data-reveal>{PROCESS.eyebrow}</p>
          <h2 className="title-lg page-h2" data-reveal>{PROCESS.title}</h2>
          <p className="lead page-lead" data-reveal>{PROCESS.intro}</p>
          <ol className="methode-steps">
            {PROCESS.steps.map((s, i) => (
              <li key={s.name} data-reveal>
                <span className="methode-steps__n">{num(i)}</span>
                <div>
                  <h3 className="methode-steps__name">{s.name}</h3>
                  <p className="methode-steps__text">{s.text}</p>
                  <p className="methode-steps__jalon">
                    <span>Jalon</span> {s.jalon}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <div className="methode-after" data-reveal>
            <p className="sr-eyebrow">{PROCESS.after.title}</p>
            <p className="title-md">{PROCESS.after.text}</p>
          </div>
        </div>
      </Reveal>

      <Contact />
      <SiteFooter />
    </main>
  );
}
