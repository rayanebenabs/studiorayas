"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { BRAND_LINE, PHASES } from "@/content/site";
import { SiteHeader } from "../SiteHeader";
import { Totem, type TotemMode } from "../Totem";

// Cinq totems superposés, un par phase. Seule la matière change, jamais la teinte (une seule couleur vive : la terre).
const LAYERS: { mode: TotemMode; tone: string }[] = [
  { mode: "trait", tone: "t-encre" },
  { mode: "plein", tone: "t-encre" },
  { mode: "regles", tone: "t-encre" },
  { mode: "plein", tone: "t-terre" },
  { mode: "plein", tone: "t-craie" },
];

const STEP = 36; // degrés entre deux cartes : 10 cartes, chaque service apparaît deux fois sur la roue
const LAST = PHASES.length - 1;

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const wheel = useRef<HTMLDivElement>(null);
  const layers = useRef<(HTMLDivElement | null)[]>([]);
  const cardEls = useRef<(HTMLDivElement | null)[]>([]);
  const trigger = useRef<ScrollTrigger | null>(null);
  const [phase, setPhase] = useState(0);

  // Pose l'état d'une phase sans défilement (mouvement réduit ou petit écran sans épinglage).
  const applyStatic = useCallback((i: number) => {
    gsap.set(wheel.current, { rotation: -i * STEP });
    layers.current.forEach((el, k) => gsap.set(el, { opacity: k === i ? 1 : 0 }));
    cardEls.current.forEach((el, k) => gsap.set(el, { opacity: k === i ? 0 : 1 }));
    setPhase(i);
  }, []);

  useLayoutEffect(() => {
    if (!root.current) return;
    if (prefersReducedMotion()) {
      applyStatic(0);
      return;
    }
    const ctx = gsap.context(() => {
      layers.current.forEach((el, k) => gsap.set(el, { opacity: k === 0 ? 1 : 0 }));
      const tl = gsap.timeline({ defaults: { ease: "none" } });
      tl.to(wheel.current, { rotation: -LAST * STEP, duration: LAST }, 0);
      for (let i = 1; i <= LAST; i++) {
        tl.to(layers.current[i - 1], { opacity: 0, duration: 0.35 }, i - 0.6);
        tl.to(layers.current[i], { opacity: 1, duration: 0.35 }, i - 0.6);
      }
      // La carte du service en cours passe derrière le totem : on l'efface pendant qu'elle y est.
      gsap.set(cardEls.current[0], { opacity: 0 });
      for (let k = 0; k <= LAST; k++) {
        const card = cardEls.current[k];
        if (k > 0) tl.to(card, { opacity: 0, duration: 0.3 }, k - 0.45);
        if (k < LAST) tl.to(card, { opacity: 1, duration: 0.3 }, k + 0.15);
      }
      trigger.current = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: () => `+=${window.innerHeight * LAST * 0.9}`,
        pin: true,
        scrub: 0.6,
        animation: tl,
        snap: { snapTo: 1 / LAST, inertia: false, duration: { min: 0.2, max: 0.5 }, ease: "power1.inOut" },
        onUpdate: (self) => setPhase(Math.round(self.progress * LAST)),
      });
    }, root);
    return () => {
      trigger.current = null;
      ctx.revert();
    };
  }, [applyStatic]);

  const go = (i: number) => {
    const target = Math.max(0, Math.min(LAST, i));
    const st = trigger.current;
    if (st) {
      window.scrollTo({ top: st.start + ((st.end - st.start) * target) / LAST, behavior: "instant" });
    } else {
      applyStatic(target);
    }
  };

  const p = PHASES[phase];
  const dark = p.totem === "nuit";
  const cards = Array.from({ length: 10 }, (_, k) => PHASES[k % PHASES.length]);

  return (
    <section ref={root} className="hero" data-dark={dark} id="top" aria-label="Studio Rayas, studio de marque">
      <SiteHeader home />

      <div ref={wheel} className="hero__wheel" aria-hidden="true">
        {cards.map((c, k) => (
          <div
            key={k}
            ref={(el) => {
              cardEls.current[k] = el;
            }}
            className="hero__card"
            style={{ ["--a" as string]: `${k * STEP}deg`, opacity: k === 0 ? 0 : 1 }}
          >
            <span className="hero__card-n">{c.n}</span>
            <span className="hero__card-name">{c.name}</span>
          </div>
        ))}
      </div>

      <div className="hero__totem">
        {LAYERS.map((l, k) => (
          <div
            key={k}
            ref={(el) => {
              layers.current[k] = el;
            }}
            className={l.tone}
            style={{ position: "absolute", inset: 0, opacity: k === 0 ? 1 : 0 }}
          >
            <Totem mode={l.mode} title={k === 0 ? "Totem Studio Rayas" : undefined} />
          </div>
        ))}
      </div>

      <div className="hero__side hero__side--left" aria-live="polite">
        <p className="sr-eyebrow">Studio de marque · service</p>
        <p className="hero__phase">{p.name}</p>
        <p className="hero__line">{p.line}</p>
      </div>

      <div className="hero__side hero__side--right">
        <p className="hero__count">
          {p.n} / 0{PHASES.length}
        </p>
        <div className="hero__progress" aria-hidden="true">
          {PHASES.map((x, k) => (
            <span key={x.n} data-on={k === phase} />
          ))}
        </div>
        <div className="hero__arrows">
          <button type="button" className="hero__arrow" onClick={() => go(phase - 1)} disabled={phase === 0} aria-label="Service précédent">
            ←
          </button>
          <button type="button" className="hero__arrow" onClick={() => go(phase + 1)} disabled={phase === LAST} aria-label="Service suivant">
            →
          </button>
        </div>
      </div>

      <h1 className="hero__title">{BRAND_LINE}</h1>
      <p className="hero__hint">Faites défiler, ou utilisez les flèches.</p>
    </section>
  );
}
