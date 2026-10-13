"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion, scrollLock, WHEEL_EFFORT, WHEEL_RESET } from "@/lib/gsap";
import { BRAND_LINE, PHASES } from "@/content/site";
import { TOTEM_PATHS, TOTEM_TRANSFORM, TOTEM_VIEWBOX } from "@/lib/totem";
import { SiteHeader } from "../SiteHeader";

const STEP = 36; // degrés entre deux cartes : 10 cartes, chaque service apparaît deux fois sur la roue
const LAST = PHASES.length - 1;
const RULES =
  "couleur.fond = craie · accent = terre, un par écran · rayon = 0 · ombre = aucune · dégradé = aucun · titre = Cormorant 300 · texte = Archivo · adresse = vous · ";
// La silhouette du totem, en masque CSS (mêmes tracés que le contour).
const TOTEM_MASK = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${TOTEM_VIEWBOX}"><g transform="${TOTEM_TRANSFORM}">${TOTEM_PATHS.map((d) => `<path d="${d}"/>`).join("")}</g></svg>`,
)}")`;
const STEP_DURATION = 1.1; // secondes pour passer d'un service au suivant
const HOLD = 0.45; // pause après chaque passage, le temps de lire avant le geste suivant
const DRAG = 0.45; // part de la hauteur d'écran que le doigt parcourt pour un service entier
const FLICK = 0.5; // vitesse du doigt (px/ms) au-delà de laquelle un lancer passe au service suivant
const WHEEL_PREVIEW = 0.35; // part du service que la molette fait avancer avant d'atteindre l'effort
// Au doigt, le passage est plus vif : le défilement est déjà bloqué pendant l'animation, pas besoin d'une longue pause.
const STEP_DURATION_TOUCH = 0.7;
const HOLD_TOUCH = 0.15;
const isTouch = () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

/**
 * Le hero : un seul totem dont la matière change à chaque phase, par volets.
 * 01 trait · 02 l'encre monte · 03 l'encre se retire sur les règles · 04 la terre monte · 05 la nuit s'ouvre.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const wheel = useRef<HTMLDivElement>(null);
  const wheelIntro = useRef<HTMLDivElement>(null);
  const totem = useRef<HTMLDivElement>(null);
  const night = useRef<HTMLDivElement>(null);
  const rules = useRef<HTMLDivElement>(null);
  const fills = useRef<(HTMLDivElement | null)[]>([]);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const segs = useRef<(HTMLSpanElement | null)[]>([]);
  const phaseText = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const [phase, setPhase] = useState(0);
  const first = useRef(true);
  const busy = useRef(false);
  const travel = useRef<gsap.core.Tween | null>(null);
  const holding = useRef(false);
  const unhold = useCallback(() => {
    if (!holding.current) return;
    holding.current = false;
    scrollLock.release();
  }, []);

  // Amène le défilement sur un service, en douceur, puis marque une pause pour laisser lire.
  const scrollToPhase = useCallback((i: number, duration?: number) => {
    const st = trigger.current;
    if (!st) return;
    busy.current = true;
    if (!holding.current) {
      holding.current = true;
      scrollLock.hold();
    }
    travel.current?.kill();
    travel.current = gsap.to(window, {
      scrollTo: { y: st.start + ((st.end - st.start) * i) / LAST, autoKill: false },
      duration: duration ?? (isTouch() ? STEP_DURATION_TOUCH : STEP_DURATION),
      ease: "power2.inOut",
      onComplete: () => {
        travel.current = gsap.delayedCall(isTouch() ? HOLD_TOUCH : HOLD, () => {
          busy.current = false;
          unhold();
        });
      },
    });
  }, [unhold]);

  const buildTimeline = useCallback(() => {
    const [encre, terre, craie] = fills.current;
    // Le CSS cache les aplats sous le totem (translateY 100 %) avant l'hydratation : GSAP reprend la main en pourcentage.
    gsap.set(fills.current, { y: 0, yPercent: 100 });
    const t = gsap.timeline({ paused: true, defaults: { ease: "none" } });
    t.to(wheel.current, { rotation: -LAST * STEP, duration: LAST }, 0);

    // 01 → 02 : l'encre remplit le totem de bas en haut.
    t.fromTo(encre, { yPercent: 100 }, { yPercent: 0, duration: 0.6, ease: "power3.inOut" }, 0.35);
    t.set(rules.current, { opacity: 1 }, 0.95);
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

      trigger.current = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: () => `+=${window.innerHeight * LAST * 0.9}`,
        pin: true,
        scrub: isTouch() ? 0.1 : 0.5,
        animation: tl.current,
        // Filet de sécurité (barre de défilement, élan d'un défilement venu d'en dessous) : on se pose sur un service.
        snap: { snapTo: 1 / LAST, inertia: false, delay: 0.25, duration: { min: 0.4, max: 0.9 }, ease: "power2.inOut" },
        onUpdate: (self) => setPhase(Math.round(self.progress * LAST)),
      });

      // Un geste = un service. La molette, le doigt et le clavier avancent d'un service à la fois,
      // au lieu de traverser tout le hero d'un coup. Aux deux bouts, le défilement reprend la main.
      const position = () => {
        const st = trigger.current;
        if (!st) return null;
        const y = window.scrollY;
        if (y < st.start - 2 || y > st.end + 2) return null;
        return ((y - st.start) / (st.end - st.start)) * LAST;
      };
      const targetFrom = (pos: number, dir: number) => (dir > 0 ? Math.floor(pos + 0.05) + 1 : Math.ceil(pos - 0.05) - 1);
      const inside = (t: number) => t >= 0 && t <= LAST;
      const phaseY = (f: number) => {
        const st = trigger.current!;
        return st.start + ((st.end - st.start) * f) / LAST;
      };
      const clampPhase = (f: number) => Math.max(0, Math.min(LAST, f));
      // Renvoie vrai quand le hero garde le geste pour lui (le défilement natif est alors bloqué).
      const handle = (dir: number, advance = true) => {
        const pos = position();
        if (pos === null) return false;
        const target = targetFrom(pos, dir);
        if (!inside(target)) return false;
        if (advance && !busy.current) scrollToPhase(target);
        return true;
      };

      let lastWheel = 0;
      let lastDelta = 0;
      let effort = 0; // distance de molette cumulée vers le service suivant
      let afterStep = false; // on vient de changer de service : la traîne du geste ne compte pas
      let released = false; // l'effort de sortie est fourni : le défilement reprend la main
      let wheelBase = 0; // service d'où part le geste de molette
      let settle = 0;
      let preview: gsap.core.Tween | null = null;
      // La molette fait déjà bouger l'animation pendant qu'elle cumule l'effort ; sans suite, elle revient.
      const follow = (f: number, duration: number) => {
        preview?.kill();
        preview = gsap.to(window, { scrollTo: { y: phaseY(f), autoKill: false }, duration, ease: "power2.out" });
      };
      // Sur le dernier service, la molette doit aussi fournir son effort avant de quitter le hero.
      const atEnd = () => {
        const pos = position();
        return pos !== null && pos >= LAST - 0.05;
      };
      const onWheel = (e: WheelEvent) => {
        if (e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
        scrollLock.wheel();
        const now = performance.now();
        const delta = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY; // molettes réglées en lignes
        const d = Math.abs(delta);
        if (d < 1) return;
        const dir = Math.sign(delta);
        // Le geste s'arrête ou change de sens : l'effort repart de zéro.
        if (now - lastWheel > WHEEL_RESET || Math.sign(effort) !== dir) {
          effort = 0;
          released = false;
        }
        // L'élan d'un pavé tactile envoie une traîne d'événements qui décroissent : ce n'est pas un nouveau geste.
        const tail = now - lastWheel < 150 && d <= lastDelta * 1.2;
        lastWheel = now;
        lastDelta = d;
        if (!handle(dir, false)) {
          if (dir > 0 && !released && atEnd()) {
            if (!busy.current && !(afterStep && tail)) {
              afterStep = false;
              effort += delta;
              if (effort >= WHEEL_EFFORT) {
                // L'effort est fourni : ce cran-là fait déjà défiler la page.
                effort = 0;
                released = true;
                scrollLock.free(delta);
                return;
              }
            }
            e.preventDefault();
            return;
          }
          effort = 0;
          return;
        }
        e.preventDefault();
        if (busy.current) return;
        if (afterStep && tail) return;
        afterStep = false;
        if (effort === 0) wheelBase = Math.round(position() ?? 0);
        effort += delta;
        window.clearTimeout(settle);
        if (Math.abs(effort) >= WHEEL_EFFORT) {
          effort = 0;
          afterStep = true;
          preview?.kill();
          handle(dir);
          return;
        }
        follow(clampPhase(wheelBase + (effort / WHEEL_EFFORT) * WHEEL_PREVIEW), 0.25);
        settle = window.setTimeout(() => {
          if (busy.current) return;
          effort = 0;
          follow(wheelBase, 0.35);
        }, WHEEL_RESET);
      };

      // Au doigt, l'animation suit le doigt dans les deux sens ; au lâcher, elle se pose sur un service.
      let startY = 0;
      let dir = 0;
      let held = false;
      let base = 0; // position (en services) au moment où le doigt se pose
      let lastY = 0;
      let lastT = 0;
      let speed = 0;
      const onTouchStart = (e: TouchEvent) => {
        startY = lastY = e.touches[0].clientY;
        lastT = performance.now();
        speed = 0;
        dir = 0;
        held = false;
      };
      const onTouchMove = (e: TouchEvent) => {
        const y = e.touches[0].clientY;
        const dy = startY - y;
        if (!dir) {
          if (!dy) return;
          dir = Math.sign(dy);
          const pos = position();
          held = pos !== null && (busy.current || inside(targetFrom(pos, dir)));
          if (!held || pos === null) return;
          // Le doigt reprend la main, même au milieu d'un passage.
          travel.current?.kill();
          busy.current = false;
          unhold();
          base = pos;
        }
        if (!held) return;
        if (e.cancelable) e.preventDefault();
        const now = performance.now();
        if (now > lastT) speed = (lastY - y) / (now - lastT);
        lastY = y;
        lastT = now;
        // Un service à la fois : le doigt ne dépasse pas le service voisin de celui de départ.
        const lo = Math.max(0, Math.ceil(base - 0.001) - 1);
        const hi = Math.min(LAST, Math.floor(base + 0.001) + 1);
        const f = Math.max(lo, Math.min(hi, base + dy / (window.innerHeight * DRAG)));
        window.scrollTo({ top: phaseY(f), behavior: "instant" });
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
        target = clampPhase(target);
        scrollToPhase(target, Math.max(0.25, Math.abs(target - pos) * STEP_DURATION_TOUCH));
      };

      const onKey = (e: KeyboardEvent) => {
        if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
        const el = e.target as HTMLElement | null;
        if (el?.closest?.("input, textarea, select, [contenteditable]")) return;
        const down = ["ArrowDown", "PageDown"].includes(e.key) || (e.key === " " && !e.shiftKey);
        const up = ["ArrowUp", "PageUp"].includes(e.key) || (e.key === " " && e.shiftKey);
        if (!down && !up) return;
        if (e.key === " " && el?.closest?.("button, a")) return;
        if (handle(down ? 1 : -1)) e.preventDefault();
      };

      window.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: false });
      window.addEventListener("touchend", onTouchEnd, { passive: true });
      window.addEventListener("touchcancel", onTouchEnd, { passive: true });
      window.addEventListener("keydown", onKey);
      const cleanups = [
        () => window.removeEventListener("wheel", onWheel),
        () => window.removeEventListener("touchstart", onTouchStart),
        () => window.removeEventListener("touchmove", onTouchMove),
        () => window.removeEventListener("touchend", onTouchEnd),
        () => window.removeEventListener("touchcancel", onTouchEnd),
        () => {
          window.clearTimeout(settle);
          preview?.kill();
        },
        () => window.removeEventListener("keydown", onKey),
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
      travel.current?.kill();
      busy.current = false;
      unhold();
      trigger.current = null;
      tl.current = null;
      ctx.revert();
    };
  }, [buildTimeline, scrollToPhase, unhold]);

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
  const dark = phase === LAST;
  const wheelCards = Array.from({ length: 10 }, (_, k) => PHASES[k % PHASES.length]);
  const lines = Array.from({ length: 72 }, (_, i) => i);

  return (
    <section ref={root} className="hero" data-dark={dark} id="top" aria-label="Studio Rayas, studio de marque">
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
            <div className="hero__ticker">
              {lines.map((i) => (
                <p key={i}>{RULES.repeat(3)}</p>
              ))}
            </div>
          </div>
          {["encre", "terre", "craie"].map((c, i) => (
            <div
              key={c}
              ref={(el) => {
                fills.current[i] = el;
              }}
              className="hero__fill"
              style={{ background: `var(--sr-color-${c})` }}
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
