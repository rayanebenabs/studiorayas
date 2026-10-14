import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ButtonLink } from "@/components/brand";
import { GUIDE, INSTAGRAM_URL, OUTRO, PARTS, SAFEGUARDS, TIKTOK_URL, type GuidePoint } from "@/content/guide-ia";

// Page non répertoriée : absente des menus et du plan du site, fermée aux moteurs. Seul le lien partagé y mène.
export const metadata: Metadata = {
  title: `${GUIDE.title} · Studio Rayas`,
  description: "Un guide sans prompts : des façons concrètes de se faire accompagner par l'IA, de l'atelier jusqu'à l'admin.",
  robots: { index: false, follow: false, nocache: true },
};

const num = (i: number) => String(i + 1).padStart(2, "0");

function Points({ items }: { items: GuidePoint[] }) {
  return (
    <ul className="guide-points">
      {items.map((p) => (
        <li key={p.title}>
          <strong>{p.title}</strong> {p.text}
        </li>
      ))}
    </ul>
  );
}

export default function GuidePage() {
  return (
    <main className="guide">
      <SiteHeader />

      <header className="guide-hero container">
        <p className="sr-eyebrow">Guide · {GUIDE.date} · {GUIDE.author}</p>
        <h1 className="title-xl">{GUIDE.title}</h1>
        <p className="lead">{GUIDE.intro[0]}</p>
      </header>

      <div className="guide-layout container">
        <nav className="guide-toc" aria-label="Sommaire du guide">
          <p className="sr-eyebrow">Sommaire</p>
          <ol>
            <li><a href="#avant">Avant de commencer</a></li>
            {PARTS.map((p, i) => (
              <li key={p.id}>
                <a href={`#${p.id}`}><span>{num(i)}</span> {p.title}</a>
              </li>
            ))}
            <li><a href="#garde-fous">Garde-fous</a></li>
            <li><a href="#continuer">Pour continuer</a></li>
          </ol>
        </nav>

        <article className="guide-body">
          <section id="avant" className="guide-part">
            <h2 className="title-md">Avant de commencer</h2>
            <p>{GUIDE.intro[1]}</p>
            <p>Trois règles traversent tout le guide :</p>
            <ol className="guide-rules">
              {GUIDE.rules.map((r) => (
                <li key={r.title}>
                  <strong>{r.title}</strong> {r.text}
                </li>
              ))}
            </ol>
            <p className="muted">{GUIDE.howTo}</p>
          </section>

          {PARTS.map((p, i) => (
            <section key={p.id} id={p.id} className="guide-part">
              <p className="guide-part__num">{num(i)}</p>
              <h2 className="title-md">{p.title}</h2>
              <p className="guide-part__intro">{p.intro}</p>
              <Points items={p.points} />
              {p.note && <p className="guide-note">{p.note}</p>}
            </section>
          ))}

          <section id="garde-fous" className="guide-part">
            <h2 className="title-md">{SAFEGUARDS.title}</h2>
            <p className="guide-part__intro">{SAFEGUARDS.intro}</p>
            <Points items={SAFEGUARDS.points} />
            <p>{SAFEGUARDS.startLead}</p>
            <ol className="guide-steps">
              {SAFEGUARDS.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </section>
        </article>
      </div>

      <section id="continuer" className="section section--encre guide-outro">
        <div className="container">
          <p className="sr-eyebrow">{OUTRO.title}</p>
          <p className="title-lg italic">{OUTRO.line}</p>
          <div className="guide-outro__text">
            <p>{OUTRO.about}</p>
            <p>{OUTRO.social}</p>
            <p>{OUTRO.share}</p>
          </div>
          <div className="guide-outro__actions">
            <ButtonLink href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" size="lg">
              Suivre @studiorayas sur Instagram
            </ButtonLink>
            <Link href="/" className="sr-btn sr-btn--secondary sr-btn--lg guide-outro__site">
              Découvrir le studio
            </Link>
          </div>
          <p className="guide-outro__more">
            Aussi sur <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer">TikTok</a>.
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
