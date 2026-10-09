"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { STEPS } from "@/content/site";
import { tokens } from "@/brand/build/tokens.js";

const DOCS = [
  { name: "Charte_v3_FINAL.pdf", note: "48 pages, jamais rouverte", x: 4, y: 7, r: -7, dx: -40, dy: -30 },
  { name: "Deck_lancement.key", note: "Le ton change à la slide 12", x: 65, y: 7, r: 6, dx: 50, dy: -40 },
  { name: "Notes du fondateur", note: "Ce qu'on dit à l'oral", x: 4, y: 39, r: 4, dx: -70, dy: 10 },
  { name: "Site actuel", note: "Deux polices de titre", x: 65, y: 39, r: -5, dx: 60, dy: 20 },
  { name: "Posts Instagram", note: "Trois rouges différents", x: 4, y: 72, r: 5, dx: -30, dy: 50 },
  { name: "Brief_agence.docx", note: "« Moderne et premium »", x: 65, y: 72, r: -4, dx: 40, dy: 60 },
];

const CODE = [
  // Valeurs affichées comme du texte : celles de brand/tokens.json.
  { k: '"fond"', v: `"${tokens.light.color.palette.craie}"`, sw: "var(--sr-color-craie)" },
  { k: '"accent"', v: `"${tokens.light.color.palette.terre}"`, sw: "var(--sr-color-terre)" },
  { k: '"rayon"', v: "0" },
  { k: '"ombre"', v: '"aucune"' },
  { k: '"titre"', v: '"Cormorant 300"' },
  { k: '"adresse"', v: '"vous"' },
  { k: '"interdits"', v: '["solution", "booster", "360°"]' },
];

const TREE = ["brand-os/", "├─ core/", "│  ├─ brand-core.md", "│  ├─ faits.md", "│  └─ tokens.json", "├─ kits/", "├─ tests/", "└─ JOURNAL.md"];

/** Un mot hors marque : la version soulignée en terre se pose par-dessus au moment du check. */
function Bad({ children }: { children: string }) {
  return (
    <span className="check__bad">
      {children}
      <span className="check__bad-on" aria-hidden="true">
        {children}
      </span>
    </span>
  );
}

export function Steps() {
  const root = useRef<HTMLElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);

  useLayoutEffect(() => {
    if (!root.current) return;
    if (prefersReducedMotion()) {
      setReduced(true);
      return;
    }
    const ctx = gsap.context(() => {
      const scenes = gsap.utils.toArray<HTMLElement>(".steps__scene");
      const bars = gsap.utils.toArray<HTMLElement>(".steps__bar");
      gsap.set(scenes, { opacity: (i) => (i === 0 ? 1 : 0) });
      const tl = gsap.timeline({ defaults: { ease: "none" } });

      // 1. Rassembler : les documents arrivent de travers et s'alignent autour du diagnostic.
      gsap.utils.toArray<HTMLElement>(".doc").forEach((d, i) => {
        const doc = DOCS[i];
        tl.fromTo(d, { x: doc.dx, y: doc.dy, rotation: doc.r * 2, opacity: 0.3 }, { x: 0, y: 0, rotation: 0, opacity: 1, duration: 0.7 }, i * 0.04);
      });
      tl.fromTo(".diag", { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.4);

      // 2. Écrire : l'arborescence puis les règles, ligne après ligne.
      tl.to(scenes[0], { opacity: 0, duration: 0.15 }, 0.9).to(scenes[1], { opacity: 1, duration: 0.15 }, 0.95);
      tl.fromTo(".code__tree span", { opacity: 0 }, { opacity: 1, stagger: 0.04, duration: 0.1 }, 1.05);
      tl.fromTo(".code__line", { opacity: 0, x: -8 }, { opacity: 1, x: 0, stagger: 0.08, duration: 0.1 }, 1.2);
      tl.fromTo(".code__quote", { opacity: 0 }, { opacity: 1, duration: 0.15 }, 1.75);

      // 3. Appliquer : des filets partent de brand-os/ et chaque support se dessine.
      tl.to(scenes[1], { opacity: 0, duration: 0.15 }, 1.9).to(scenes[2], { opacity: 1, duration: 0.15 }, 1.95);
      tl.fromTo(".apply__line", { strokeDashoffset: 1 }, { strokeDashoffset: 0, stagger: 0.08, duration: 0.3 }, 2.05);
      tl.fromTo(".out", { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, stagger: 0.1, duration: 0.2 }, 2.25);

      // 4. Vérifier : les mots interdits se soulignent, la note tombe, la correction arrive.
      tl.to(scenes[2], { opacity: 0, duration: 0.15 }, 2.9).to(scenes[3], { opacity: 1, duration: 0.15 }, 2.95);
      tl.fromTo(".check__bad-on", { opacity: 0 }, { opacity: 1, stagger: 0.1, duration: 0.1 }, 3.05);
      tl.fromTo(".check__score", { opacity: 0 }, { opacity: 1, duration: 0.15 }, 3.4);
      tl.fromTo(".check__fix", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.15 }, 3.55);
      tl.fromTo(".check__log li:first-child", { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.15 }, 3.75);
      tl.to({}, { duration: 0.1 }, 3.9);

      bars.forEach((b, i) => tl.fromTo(b, { scaleX: 0 }, { scaleX: 1, duration: 1 }, i));

      trigger.current = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "+=320%",
        pin: true,
        scrub: 0.5,
        animation: tl,
        onUpdate: (self) => setActive(Math.min(STEPS.length - 1, Math.floor(self.progress * STEPS.length))),
      });
    }, root);
    return () => {
      trigger.current = null;
      ctx.revert();
    };
  }, []);

  const go = (i: number) => {
    const st = trigger.current;
    if (st) window.scrollTo({ top: st.start + ((st.end - st.start) * (i + 0.5)) / STEPS.length, behavior: "instant" });
    else setActive(i);
  };

  const sceneStyle = (i: number) => (reduced ? { opacity: i === active ? 1 : 0 } : undefined);

  return (
    <section ref={root} className="steps" data-reduced={reduced} aria-label="Comment fonctionne un Brand OS">
      <div className="container">
        <div className="steps__grid">
          <div>
            <p className="sr-eyebrow">
              Le Brand OS · {String(active + 1).padStart(2, "0")} / 0{STEPS.length}
            </p>
            <h2 className="title-lg" style={{ marginTop: "var(--sr-space-4)" }}>
              La marque, écrite
              <br />
              comme du code.
            </h2>
            <ol className="steps__list">
              {STEPS.map((s, i) => (
                <li key={s.title} className="steps__item" data-on={i === active}>
                  <span className="steps__bar" style={reduced && i === active ? { transform: "scaleX(1)" } : undefined} />
                  <span className="steps__n">0{i + 1}</span>
                  <button type="button" className="hotspot" style={{ cursor: "pointer" }} onClick={() => go(i)} aria-current={i === active ? "step" : undefined}>
                    <span className="steps__title">{s.title}</span>
                  </button>
                  <p className="steps__text">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="steps__panel" aria-hidden="true">
            <div className="steps__scene" style={sceneStyle(0)}>
              {DOCS.map((d) => (
                <div key={d.name} className="doc" style={{ left: `${d.x}%`, top: `${d.y}%` }}>
                  <strong>{d.name}</strong>
                  <span>{d.note}</span>
                </div>
              ))}
              <div className="diag">Diagnostic</div>
            </div>

            <div className="steps__scene" style={sceneStyle(1)}>
              <div className="code">
                <div className="code__tree">
                  {TREE.map((t) => (
                    <span key={t} style={{ display: "block" }}>
                      {t}
                    </span>
                  ))}
                </div>
                <div className="code__file">
                  <p className="muted">tokens.json</p>
                  {CODE.map((c) => (
                    <div key={c.k} className="code__line">
                      <span className="code__key">{c.k}:</span>
                      <span>{c.v}</span>
                      {c.sw && <span className="code__swatch" style={{ background: c.sw }} />}
                    </div>
                  ))}
                  <span className="code__cursor" />
                  <p className="code__quote">« On rend l&apos;artistique technique. »</p>
                </div>
              </div>
            </div>

            <div className="steps__scene" style={sceneStyle(2)}>
              <svg className="apply__svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                {[
                  [21, 22],
                  [82, 24],
                  [22, 82],
                  [80, 80],
                ].map(([x, y]) => (
                  <path key={`${x}-${y}`} className="apply__line" d={`M50 50 L${x} ${y}`} pathLength={1} strokeDasharray="1" vectorEffect="non-scaling-stroke" />
                ))}
              </svg>
              <div className="apply__hub">brand-os/</div>
              <div className="out out--site">
                <p className="sr-eyebrow">Site</p>
                <p className="out__title">Commencer par un diagnostic.</p>
                <span className="out__btn">Réserver</span>
              </div>
              <div className="out out--post">
                <p className="sr-eyebrow">Post</p>
                <p className="out__title">Une marque qui tient sans son auteur.</p>
              </div>
              <div className="out out--mail">
                <p className="sr-eyebrow">E-mail</p>
                <p>Bonjour Claire, votre diagnostic est prêt. Le premier jalon arrive jeudi.</p>
              </div>
              <div className="out out--agent">
                <p className="sr-eyebrow">Agent IA</p>
                <p className="bubble bubble--q">Écris l&apos;annonce du lancement.</p>
                <p className="bubble bubble--a">Vous repartez avec les règles, pas seulement le logo.</p>
              </div>
            </div>

            <div className="steps__scene" style={sceneStyle(3)}>
              <div className="check">
                <p className="sr-eyebrow">Brand-check</p>
                <p className="check__phrase">
                  « Découvrez nos <Bad>solutions</Bad> <Bad>clé en main</Bad> pour{" "}
                  <Bad>booster</Bad> votre image ! »
                </p>
                <div className="check__score">
                  <strong>2 / 5</strong>
                  <span>Trois mots du lexique interdit, un point d&apos;exclamation.</span>
                </div>
                <div className="check__fix">
                  <small>Proposition</small>
                  <p className="check__phrase">« Vous repartez avec les règles, pas seulement le logo. »</p>
                </div>
                <div className="check__log">
                  <p className="sr-eyebrow">Journal</p>
                  <ul>
                    <li>
                      <code>1.2.0</code> Nouveau canal : newsletter
                    </li>
                    <li>
                      <code>1.1.0</code> Ajout du Sparring à l&apos;offre
                    </li>
                    <li>
                      <code>1.0.0</code> Livraison du Brand OS
                    </li>
                  </ul>
                  <span className="check__example muted">Exemple de journal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
