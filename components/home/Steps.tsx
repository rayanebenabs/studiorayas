"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { STEPS } from "@/content/site";
import { tokens } from "@/brand/build/tokens.js";

// Les documents d'avant : dispersés, de travers. Position du centre en % de la scène.
const DOCS = [
  { name: "Charte_v3_FINAL.pdf", note: "48 pages, jamais rouverte", x: 21, y: 17, r: -9 },
  { name: "Deck_lancement.key", note: "Le ton change à la slide 12", x: 55, y: 12, r: 6 },
  { name: "Notes du fondateur", note: "Ce qu'on dit à l'oral", x: 82, y: 30, r: 8 },
  { name: "Site actuel", note: "Deux polices de titre", x: 19, y: 60, r: 7 },
  { name: "Posts Instagram", note: "Trois rouges différents", x: 50, y: 84, r: -6 },
  { name: "Brief_agence.docx", note: "« Moderne et premium »", x: 81, y: 72, r: -8 },
];

const TREE = ["├─ core/", "│  ├─ brand-core.md", "│  ├─ faits.md", "│  └─ tokens.json", "├─ kits/", "├─ tests/", "└─ JOURNAL.md"];

// Valeurs affichées comme du texte : celles de brand/tokens.json.
const CODE = [
  { k: '"fond"', v: `"${tokens.light.color.palette.craie}"`, sw: "var(--sr-color-craie)" },
  { k: '"accent"', v: `"${tokens.light.color.palette.terre}"`, sw: "var(--sr-color-terre)" },
  { k: '"rayon"', v: "0" },
  { k: '"ombre"', v: '"aucune"' },
  { k: '"titre"', v: '"Cormorant 300"' },
  { k: '"adresse"', v: '"vous"' },
  { k: '"interdits"', v: '["solution", "booster"]' },
];

// Centres des quatre supports et tracé des connecteurs depuis le nœud central (viewBox 0 0 100 100).
const OUTS = [
  { id: "site", x: 23, y: 21, wire: "M50 50 C50 36 23 42 23 28" },
  { id: "post", x: 80, y: 23, wire: "M50 50 C50 34 80 44 80 30" },
  { id: "mail", x: 23, y: 80, wire: "M50 50 C50 64 23 58 23 72" },
  { id: "agent", x: 77, y: 79, wire: "M50 50 C50 66 77 60 77 70" },
];

/** Un mot hors marque : la version soulignée en terre se pose par-dessus au passage du scan. */
function Bad({ children }: { children: string }) {
  return (
    <span className="os-bad">
      {children}
      <span className="os-bad__on" aria-hidden="true">
        {children}
      </span>
    </span>
  );
}

/**
 * Le Brand OS en quatre étapes, dans une seule scène dont les éléments se transforment :
 * les documents deviennent le dossier, le dossier devient l'arborescence, puis le nœud qui alimente
 * les supports, puis le badge du brand-check.
 */
export function Steps() {
  const root = useRef<HTMLElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    if (!root.current) return;
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root.current);
      const center = { xPercent: -50, yPercent: -50 };
      gsap.set([...q(".os-doc"), ...q(".os-hub"), ...q(".os-out")], center);
      DOCS.forEach((d, i) => gsap.set(q(".os-doc")[i], { left: `${d.x}%`, top: `${d.y}%`, rotation: d.r }));
      OUTS.forEach((o, i) => gsap.set(q(".os-out")[i], { left: `${o.x}%`, top: `${o.y}%` }));
      gsap.set(q(".os-hub"), { left: "50%", top: "50%", scale: 0.4, opacity: 0 });

      const t = gsap.timeline({ paused: true, defaults: { ease: "none" } });

      // 01 Rassembler : la pile se forme, puis devient le dossier brand-os/.
      q(".os-doc").forEach((el, i) => {
        t.to(el, { left: "50%", top: "50%", rotation: (i - 2.5) * 2.2, scale: 0.62, duration: 0.6, ease: "power3.inOut" }, 0.08 + i * 0.03);
      });
      t.to(q(".os-doc"), { opacity: 0, duration: 0.12, stagger: 0.015 }, 0.72);
      t.to(q(".os-hub"), { scale: 1, opacity: 1, duration: 0.25, ease: "expo.out" }, 0.74);

      // 02 Écrire : le dossier devient la racine de l'arborescence, tokens.json se tape.
      t.to(q(".os-hub"), { left: "21%", top: "13%", scale: 0.78, duration: 0.3, ease: "power3.inOut" }, 1.0);
      t.fromTo(q(".os-tree span"), { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.12, stagger: 0.035, ease: "power2.out" }, 1.2);
      t.fromTo(q(".os-code"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.15, ease: "power2.out" }, 1.15);
      q(".os-code__line").forEach((el, i) => {
        const at = 1.3 + i * 0.07;
        t.fromTo(el, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.08 }, at);
        const sw = el.querySelector(".os-code__swatch");
        if (sw) t.fromTo(sw, { scale: 0 }, { scale: 1, duration: 0.06, ease: "expo.out" }, at + 0.08);
      });
      t.fromTo(q(".os-code__quote"), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.12 }, 1.85);

      // 03 Appliquer : l'arborescence se replie en nœud, les connecteurs se tracent, les supports se construisent.
      t.to([...q(".os-tree"), ...q(".os-code")], { opacity: 0, x: -16, duration: 0.15, ease: "power2.in" }, 2.0);
      t.to(q(".os-hub"), { left: "50%", top: "50%", scale: 1, duration: 0.3, ease: "power3.inOut" }, 2.0);
      t.fromTo(q(".os-wire"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.3, stagger: 0.05, ease: "power2.inOut" }, 2.25);
      t.fromTo(q(".os-out"), { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.18, stagger: 0.05, ease: "expo.out" }, 2.4);
      t.fromTo(q(".os-skel i"), { scaleX: 0 }, { scaleX: 1, duration: 0.14, stagger: 0.015, ease: "power2.out" }, 2.5);
      t.to(q(".os-skel"), { opacity: 0, duration: 0.08 }, 2.72);
      t.fromTo(q(".os-real"), { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.12, stagger: 0.03 }, 2.72);
      t.fromTo(q(".os-pulse"), { opacity: 0 }, { opacity: 1, duration: 0.1 }, 2.6);

      // 04 Vérifier : le nœud devient le badge du check, le scan passe, la note descend puis remonte.
      t.to([...q(".os-out"), ...q(".os-wire"), ...q(".os-pulse")], { opacity: 0, duration: 0.12 }, 3.0);
      t.to(q(".os-hub"), { left: "15%", top: "8%", scale: 0.66, duration: 0.25, ease: "power3.inOut" }, 3.0);
      t.to(q(".os-hub__a"), { yPercent: -100, opacity: 0, duration: 0.12 }, 3.05);
      t.fromTo(q(".os-hub__b"), { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.12 }, 3.05);
      t.fromTo(q(".os-check"), { opacity: 0 }, { opacity: 1, duration: 0.1 }, 3.1);
      t.fromTo(q(".os-scan"), { left: "0%", opacity: 1 }, { left: "100%", duration: 0.3 }, 3.18);
      t.to(q(".os-scan"), { opacity: 0, duration: 0.04 }, 3.48);
      q(".os-bad__on").forEach((el, i) => t.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.04 }, 3.24 + i * 0.07));
      const score = { v: 5 };
      const out = q(".os-score__n")[0];
      const paint = () => {
        if (out) out.textContent = String(Math.round(score.v));
      };
      t.to(score, { v: 2, duration: 0.25, onUpdate: paint }, 3.24);
      t.to(q(".os-phrase--bad"), { opacity: 0.35, duration: 0.1 }, 3.56);
      t.fromTo(q(".os-phrase--fix"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.12, ease: "power2.out" }, 3.58);
      t.to(score, { v: 5, duration: 0.15, onUpdate: paint }, 3.62);
      t.fromTo(q(".os-log__new"), { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.1, ease: "power2.out" }, 3.75);
      t.to({}, { duration: 0.12 }, 3.88);

      // La barre de chaque étape avance avec le défilement.
      q(".steps__bar").forEach((b, i) => t.fromTo(b, { scaleX: 0 }, { scaleX: 1, duration: 1 }, i));
      tl.current = t;

      if (reduced) {
        t.progress(0.249);
        return;
      }

      // Ambiance : les documents flottent, les impulsions parcourent les connecteurs, le curseur clignote.
      q(".os-doc__inner").forEach((el, i) =>
        gsap.to(el, { y: i % 2 ? 6 : -6, duration: 2.4 + i * 0.3, ease: "sine.inOut", yoyo: true, repeat: -1 }),
      );
      gsap.fromTo(q(".os-pulse"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, ease: "none", repeat: -1, stagger: 0.25 });
      gsap.to(q(".os-code__caret"), { opacity: 0, duration: 0.5, ease: "steps(1)", repeat: -1, yoyo: true });

      trigger.current = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "+=340%",
        pin: true,
        scrub: 0.8,
        animation: t,
        onUpdate: (self) => setActive(Math.min(STEPS.length - 1, Math.floor(self.progress * STEPS.length))),
      });
    }, root);
    return () => {
      trigger.current = null;
      tl.current = null;
      ctx.revert();
    };
  }, []);

  const go = (i: number) => {
    const st = trigger.current;
    if (st) {
      window.scrollTo({ top: st.start + ((st.end - st.start) * (i + 0.97)) / STEPS.length, behavior: "instant" });
    } else {
      tl.current?.progress((i + 0.99) / STEPS.length);
      setActive(i);
    }
  };

  return (
    <section ref={root} className="steps" aria-label="Comment fonctionne un Brand OS">
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
                  <span className="steps__bar" />
                  <span className="steps__n">0{i + 1}</span>
                  <button type="button" className="hotspot" style={{ cursor: "pointer" }} onClick={() => go(i)} aria-current={i === active ? "step" : undefined}>
                    <span className="steps__title">{s.title}</span>
                  </button>
                  <p className="steps__text">{s.text}</p>
                </li>
              ))}
            </ol>
            <div className="steps__current" aria-live="polite">
              <strong>{STEPS[active].title}</strong>
              <p>{STEPS[active].text}</p>
            </div>
          </div>

          <div className="steps__panel" aria-hidden="true">
            <div className="os-stage">
              {/* 01 */}
              {DOCS.map((d) => (
                <div key={d.name} className="os-doc">
                  <div className="os-doc__inner">
                    <strong>{d.name}</strong>
                    <span>{d.note}</span>
                  </div>
                </div>
              ))}

              {/* 02 */}
              <div className="os-tree">
                {TREE.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <div className="os-code">
                <p className="os-code__file">tokens.json</p>
                {CODE.map((c) => (
                  <div key={c.k} className="os-code__line">
                    <span className="os-code__key">{c.k}:</span>
                    <span>{c.v}</span>
                    {c.sw && <span className="os-code__swatch" style={{ background: c.sw }} />}
                  </div>
                ))}
                <span className="os-code__caret" />
                <p className="os-code__quote">« On rend l&apos;artistique technique. »</p>
              </div>

              {/* 03 */}
              <svg className="os-wires" viewBox="0 0 100 100" preserveAspectRatio="none">
                {OUTS.map((o) => (
                  <path key={o.id} className="os-wire" d={o.wire} pathLength={1} strokeDasharray="1" />
                ))}
                {OUTS.map((o) => (
                  <path key={`p-${o.id}`} className="os-pulse" d={o.wire} pathLength={1} strokeDasharray="0.08 0.92" />
                ))}
              </svg>
              <div className="os-out os-out--site">
                <div className="os-skel">
                  <i style={{ width: "30%" }} />
                  <i style={{ width: "80%" }} />
                  <i style={{ width: "60%" }} />
                  <i style={{ width: "40%", height: "1.6em" }} />
                </div>
                <div className="os-real">
                  <p className="os-label">Site</p>
                  <p className="os-title">Commencer par un diagnostic.</p>
                  <span className="os-btn">Réserver</span>
                </div>
              </div>
              <div className="os-out os-out--post">
                <div className="os-skel">
                  <i style={{ width: "30%" }} />
                  <i style={{ width: "90%", marginTop: "auto" }} />
                  <i style={{ width: "70%" }} />
                </div>
                <div className="os-real">
                  <p className="os-label">Post</p>
                  <p className="os-title">Une marque qui tient sans son auteur.</p>
                </div>
              </div>
              <div className="os-out os-out--mail">
                <div className="os-skel">
                  <i style={{ width: "30%" }} />
                  <i style={{ width: "90%" }} />
                  <i style={{ width: "75%" }} />
                </div>
                <div className="os-real">
                  <p className="os-label">E-mail</p>
                  <p>Bonjour Claire, votre diagnostic est prêt. Le premier jalon arrive jeudi.</p>
                </div>
              </div>
              <div className="os-out os-out--agent">
                <div className="os-skel">
                  <i style={{ width: "30%" }} />
                  <i style={{ width: "70%", marginLeft: "auto" }} />
                  <i style={{ width: "85%" }} />
                </div>
                <div className="os-real">
                  <p className="os-label">Agent IA</p>
                  <p className="os-q">Écris l&apos;annonce du lancement.</p>
                  <p className="os-a">Vous repartez avec les règles, pas seulement le logo.</p>
                </div>
              </div>

              {/* 04 */}
              <div className="os-check">
                <div className="os-sentence">
                  <p className="os-phrase os-phrase--bad">
                    « Découvrez nos <Bad>solutions</Bad> <Bad>clé en main</Bad> pour <Bad>booster</Bad> votre image ! »
                  </p>
                  <span className="os-scan" />
                </div>
                <div className="os-score">
                  <strong>
                    <span className="os-score__n">5</span> / 5
                  </strong>
                  <span>Trois mots du lexique interdit, un point d&apos;exclamation.</span>
                </div>
                <div className="os-phrase--fix">
                  <p className="os-label os-label--accent">Proposition</p>
                  <p className="os-phrase">« Vous repartez avec les règles, pas seulement le logo. »</p>
                </div>
                <div className="os-log">
                  <p className="os-label">Journal · exemple</p>
                  <ul>
                    <li className="os-log__new">
                      <code>1.2.0</code> Nouveau canal : newsletter
                    </li>
                    <li>
                      <code>1.1.0</code> Ajout du Sparring à l&apos;offre
                    </li>
                  </ul>
                </div>
              </div>

              {/* Le fil conducteur : le même bloc d'un bout à l'autre. */}
              <div className="os-hub">
                <span className="os-hub__a">brand-os/</span>
                <span className="os-hub__b">brand-check</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
