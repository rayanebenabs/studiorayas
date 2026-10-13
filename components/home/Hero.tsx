"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { addSettler, jumpToY, pickRest, scrollToY } from "@/lib/scroll";
import { BRAND_LINE, PHASES } from "@/content/site";
import { TOTEM_PATHS, TOTEM_TRANSFORM, TOTEM_VIEWBOX } from "@/lib/totem";
import { SiteHeader } from "../SiteHeader";

const STEP = 36; // degrés entre deux cartes : 10 cartes, chaque service apparaît deux fois sur la roue
const LAST = PHASES.length - 1;
// La silhouette du totem, en masque CSS (mêmes tracés que le contour).
const TOTEM_MASK = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${TOTEM_VIEWBOX}"><g transform="${TOTEM_TRANSFORM}">${TOTEM_PATHS.map((d) => `<path d="${d}"/>`).join("")}</g></svg>`,
)}")`;
// Les règles du totem sont une image (public/totem-rules.png, scripts/totem-rules.mjs) : 72 lignes, 18 110 unités
// de haut. Pendant Brand OS, elles glissent de six lignes (1 500 unités), en % de leur hauteur.
const RULE_TRAVEL = (1500 / 18110) * 100;
const SPAN = 0.8; // hauteur d'écran de défilement par service
const STEP_DURATION = 0.9; // secondes pour aller d'un service au suivant (flèches, calage)
const DRAG = 0.45; // part de la hauteur d'écran que le doigt parcourt pour un service entier
const FLICK = 0.5; // vitesse du doigt (px/ms) au-delà de laquelle un lancer passe au service suivant
const INTENT = 0.2; // part d'un service à franchir pour que le calage aille vers le suivant

/**
 * Le hero : un seul totem dont la matière change à chaque phase, par volets.
 * 01 trait · 02 l'encre monte · 03 l'encre se retire sur les règles · 04 la terre monte · 05 la nuit s'ouvre
 * (le jour, en mode sombre).
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const wheel = useRef<HTMLDivElement>(null);
  const wheelIntro = useRef<HTMLDivElement>(null);
  const totem = useRef<HTMLDivElement>(null);
  const night = useRef<HTMLDivElement>(null);
  const rules = useRef<HTMLDivElement>(null);
  const ticker = useRef<HTMLDivElement>(null);
  const fills = useRef<(HTMLDivElement | null)[]>([]);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const segs = useRef<(HTMLSpanElement | null)[]>([]);
  const phaseText = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const [phase, setPhase] = useState(0);
  const first = useRef(true);
  // La position de défilement de chaque service (0 à LAST, décimales comprises).
  const phaseY = useCallback((f: number) => {
    const st = trigger.current;
    return st ? st.start + ((st.end - st.start) * f) / LAST : 0;
  }, []);
  const scrollToPhase = useCallback(
    (i: number, duration = STEP_DURATION) => scrollToY(phaseY(i), { duration }),
    [phaseY],
  );

  const buildTimeline = useCallback(() => {
    const [encre, terre, craie] = fills.current;
    // Le CSS cache les aplats sous le totem (translateY 100 %) avant l'hydratation : GSAP reprend la main en pourcentage.
    gsap.set(fills.current, { y: 0, yPercent: 100 });
    const t = gsap.timeline({ paused: true, defaults: { ease: "none" } });
    t.to(wheel.current, { rotation: -LAST * STEP, duration: LAST }, 0);

    // 01 → 02 : l'encre remplit le totem de bas en haut.
    t.fromTo(encre, { yPercent: 100 }, { yPercent: 0, duration: 0.6, ease: "power3.inOut" }, 0.35);
    t.set(rules.current, { opacity: 1 }, 0.95);
    // Les règles glissent dans le totem au rythme du défilement, tant qu'on les voit : immobiles quand la page l'est.
    t.fromTo(ticker.current, { yPercent: 0 }, { yPercent: -RULE_TRAVEL, duration: 1.4 }, 0.95);
    // 02 → 03 : l'encre se retire vers le haut et découvre les règles.
    t.to(encre, { yPercent: -100, duration: 0.6, ease: "power3.inOut" }, 1.35);
    // 03 → 04 : la terre monte.
    t.fromTo(terre, { yPercent: 100 }, { yPercent: 0, duration: 0.6, ease: "power3.inOut" }, 2.35);
    // 04 → 05 : la nuit s'ouvre en cercle depuis le totem, le totem passe en craie.
    t.fromTo(night.current, { clipPath: "circle(0% at 50% 44%)" }, { clipPath: "circle(150% at 50% 44%)", duration: 0.7, ease: "power3.inOut" }, 3.3);
    t.fromTo(craie, { yPercent: 100 }, { yPercent: 0, duration: 0.6, ease: "power3.inOut" }, 3.35);

    // Le totem respire à chaque passage.
    for (let i = 1; i <= LAST; i++) {
      t.to(totem.current, { scale: 0.965, duration: 0.3, ease: "power2.inOut" }, i - 0.65);
      t.to(totem.current, { scale: 1, duration: 0.35, ease: "power2.out" }, i - 0.3);
    }
    // La carte du service en cours passe derrière le totem : elle s'efface pendant qu'elle y est.
    gsap.set(cards.current[0], { opacity: 0 });
    for (let k = 0; k <= LAST; k++) {
      if (k > 0) t.to(cards.current[k], { opacity: 0, duration: 0.3 }, k - 0.45);
      if (k < LAST) t.to(cards.current[k], { opacity: 1, duration: 0.3 }, k + 0.15);
    }
    // La progression se remplit avec le défilement.
    segs.current.forEach((s, i) => {
      if (i === 0) gsap.set(s, { scaleX: 1 });
      else t.fromTo(s, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: "power2.inOut" }, i - 0.6);
    });
    return t;
  }, []);

  useLayoutEffect(() => {
    if (!root.current) return;
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      tl.current = buildTimeline();
      if (reduced) return;

      // Intro : le totem se dessine, le titre monte mot par mot, la roue se pose.
      const paths = gsap.utils.toArray<SVGPathElement>(".hero__outline path");
      const intro = gsap.timeline({ delay: 0.1 });
      intro
        .fromTo(paths, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut", stagger: 0.1 }, 0)
        .set(".hero__title", { opacity: 1 }, 0.55)
        .fromTo(".hero__title .w > span", { yPercent: 110 }, { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.06 }, 0.55)
        .fromTo(wheelIntro.current, { rotation: 28, opacity: 0 }, { rotation: 0, opacity: 1, duration: 1.4, ease: "expo.out" }, 0.4)
        .fromTo(".site-header__inner > *", { y: -14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.08 }, 0.3)
        .fromTo("[data-intro]", { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.06 }, 0.8);

      // Le défilement pilote l'animation, dans les deux sens. Lenis lisse déjà la molette : peu de lissage ici.
      trigger.current = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: () => `+=${window.innerHeight * LAST * SPAN}`,
        pin: true,
        scrub: 0.15,
        animation: tl.current,
        onUpdate: (self) => setPhase(Math.round(self.progress * LAST)),
      });

      // Où en est le hero, en services (null hors du hero).
      const position = () => {
        const st = trigger.current;
        if (!st) return null;
        const y = window.scrollY;
        if (y < st.start - 2 || y > st.end + 2) return null;
        return ((y - st.start) / (st.end - st.start)) * LAST;
      };
      const clamp = (f: number) => Math.max(0, Math.min(LAST, f));

      // Page immobile dans le hero : elle se pose sur un service, de préférence dans le sens du geste.
      const removeSettler = addSettler((direction, y) => {
        const st = trigger.current;
        if (!st || y < st.start - 2 || y > st.end + 2) return undefined;
        return pickRest(Array.from({ length: LAST + 1 }, (_, k) => phaseY(k)), y, direction, INTENT);
      }, true);

      // Au doigt, le hero suit le doigt dans les deux sens, un service au plus ; au lâcher, il se pose.
      let startY = 0;
      let held = false;
      let decided = false;
      let base = 0;
      let lastY = 0;
      let lastT = 0;
      let speed = 0;
      const onTouchStart = (e: TouchEvent) => {
        startY = lastY = e.touches[0].clientY;
        lastT = performance.now();
        speed = 0;
        decided = false;
        held = false;
      };
      const onTouchMove = (e: TouchEvent) => {
        const y = e.touches[0].clientY;
        const dy = startY - y;
        if (!decided) {
          if (!dy) return;
          decided = true;
          const pos = position();
          // Le hero garde le geste, sauf pour en sortir : vers le haut au premier service, vers le bas au dernier.
          held = pos !== null && !(pos <= 0.01 && dy < 0) && !(pos >= LAST - 0.01 && dy > 0);
          if (!held || pos === null) return;
          base = pos;
        }
        if (!held) return;
        if (e.cancelable) e.preventDefault();
        const now = performance.now();
        if (now > lastT) speed = (lastY - y) / (now - lastT);
        lastY = y;
        lastT = now;
        const lo = Math.max(0, Math.ceil(base - 0.001) - 1);
        const hi = Math.min(LAST, Math.floor(base + 0.001) + 1);
        jumpToY(phaseY(Math.max(lo, Math.min(hi, base + dy / (window.innerHeight * DRAG)))));
      };
      const onTouchEnd = () => {
        if (!held) return;
        held = false;
        const pos = position();
        if (pos === null) return;
        if (performance.now() - lastT > 80) speed = 0; // le doigt s'était arrêté avant de se lever
        const moved = pos - base;
        const next = Math.floor(base + 0.001) + 1;
        const prev = Math.ceil(base - 0.001) - 1;
        let target = Math.round(pos);
        if (Math.abs(speed) > FLICK) target = speed > 0 ? next : prev;
        else if (Math.abs(moved) > 0.25) target = moved > 0 ? next : prev;
        target = clamp(target);
        // Au prochain rendu : Lenis traite lui aussi le lever du doigt, et couperait une animation lancée avant lui.
        requestAnimationFrame(() => scrollToPhase(target, Math.max(0.25, Math.abs(target - pos) * 0.7)));
      };

      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: false });
      window.addEventListener("touchend", onTouchEnd, { passive: true });
      window.addEventListener("touchcancel", onTouchEnd, { passive: true });
      const cleanups = [
        removeSettler,
        () => window.removeEventListener("touchstart", onTouchStart),
        () => window.removeEventListener("touchmove", onTouchMove),
        () => window.removeEventListener("touchend", onTouchEnd),
        () => window.removeEventListener("touchcancel", onTouchEnd),
      ];

      // Parallaxe légère à la souris.
      if (window.matchMedia("(pointer: fine)").matches) {
        const tx = gsap.quickTo(totem.current, "x", { duration: 0.8, ease: "power3.out" });
        const ty = gsap.quickTo(totem.current, "y", { duration: 0.8, ease: "power3.out" });
        const wx = gsap.quickTo(wheelIntro.current, "x", { duration: 1.1, ease: "power3.out" });
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          tx(nx * 14);
          ty(ny * 10);
          wx(nx * -22);
        };
        const el = root.current;
        el?.addEventListener("pointermove", onMove);
        cleanups.push(() => el?.removeEventListener("pointermove", onMove));
      }
      return () => cleanups.forEach((c) => c());
    }, root);
    return () => {
      trigger.current = null;
      tl.current = null;
      ctx.revert();
    };
  }, [buildTimeline, phaseY, scrollToPhase]);

  // Le nom du service glisse dans son masque à chaque changement de phase.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!phaseText.current || prefersReducedMotion()) return;
    const q = gsap.utils.selector(phaseText.current);
    gsap.fromTo(q(".hero__mask > *"), { yPercent: 105 }, { yPercent: 0, duration: 0.7, ease: "expo.out", stagger: 0.05 });
    gsap.fromTo(q(".hero__line"), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.1 });
  }, [phase]);

  const go = (i: number) => {
    const target = Math.max(0, Math.min(LAST, i));
    if (trigger.current) {
      scrollToPhase(target);
    } else {
      tl.current?.progress(target / LAST);
      setPhase(target);
    }
  };

  const p = PHASES[phase];
  const inverted = phase === LAST;
  const wheelCards = Array.from({ length: 10 }, (_, k) => PHASES[k % PHASES.length]);

  return (
    <section ref={root} className="hero" data-inverted={inverted} id="top" aria-label="Studio Rayas, studio de marque">
      <div ref={night} className="hero__night" aria-hidden="true" />
      <SiteHeader home />

      <div ref={wheelIntro} className="hero__wheel-intro" aria-hidden="true">
        <div ref={wheel} className="hero__wheel">
          {wheelCards.map((c, k) => (
            <div
              key={k}
              ref={(el) => {
                cards.current[k] = el;
              }}
              className="hero__card"
              style={{ ["--a" as string]: `${k * STEP}deg`, opacity: k === 0 ? 0 : 1 }}
            >
              <span className="hero__card-n">{c.n}</span>
              <span className="hero__card-name">{c.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div ref={totem} className="hero__totem">
        {/* La matière du totem : des calques HTML découpés par un masque CSS. Tout ce qui bouge dedans
            passe par des transformations, gérées par la carte graphique, sans recalcul de mise en page. */}
        <div className="hero__matter" style={{ ["--totem-mask" as string]: TOTEM_MASK }} aria-hidden="true">
          <div ref={rules} className="hero__rules" style={{ opacity: 0 }}>
            <div ref={ticker} className="hero__ticker" />
          </div>
          {/* L'encre monte, la terre monte, puis le papier : l'encre et le papier du thème en cours. */}
          {["var(--page-ink)", "var(--sr-color-terre)", "var(--page-paper)"].map((c, i) => (
            <div
              key={c}
              ref={(el) => {
                fills.current[i] = el;
              }}
              className="hero__fill"
              style={{ background: c }}
            />
          ))}
        </div>
        <svg viewBox={TOTEM_VIEWBOX} role="img" aria-label="Totem Studio Rayas">
          <g className="hero__outline" transform={TOTEM_TRANSFORM}>
            {TOTEM_PATHS.map((d) => (
              <path key={d.slice(0, 24)} d={d} pathLength={1} strokeDasharray="1" />
            ))}
          </g>
        </svg>
      </div>

      <div ref={phaseText} className="hero__side hero__side--left" aria-live="polite">
        <p className="sr-eyebrow" data-intro>
          Studio de marque · service
        </p>
        <div className="hero__mask" data-intro>
          <p className="hero__phase">{p.name}</p>
        </div>
        <p className="hero__line" data-intro>
          {p.line}
        </p>
      </div>

      <div className="hero__side hero__side--right" data-intro>
        <div className="hero__mask">
          <p className="hero__count">
            {p.n} / 0{PHASES.length}
          </p>
        </div>
        <div className="hero__progress" aria-hidden="true">
          {PHASES.map((x, k) => (
            <span key={x.n}>
              <i
                ref={(el) => {
                  segs.current[k] = el;
                }}
              />
            </span>
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

      <h1 className="hero__title" aria-label={BRAND_LINE}>
        {BRAND_LINE.split(" ").map((w, i) => (
          <span key={i}>
            <span className="w" aria-hidden="true">
              <span>{w}</span>
            </span>{" "}
          </span>
        ))}
      </h1>
      <p className="hero__hint" data-intro>
        Faites défiler, ou utilisez les flèches.
      </p>
    </section>
  );
}
