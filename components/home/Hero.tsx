"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion, scrollLock, WHEEL_EFFORT, WHEEL_RESET } from "@/lib/gsap";
import { BRAND_LINE, PHASES } from "@/content/site";
import { TOTEM_PATHS, TOTEM_TRANSFORM, TOTEM_VIEWBOX } from "@/lib/totem";
import { SiteHeader } from "../SiteHeader";

const STEP = 36; // degrés entre deux cartes : 10 cartes, chaque service apparaît deux fois sur la roue
const LAST = PHASES.length - 1;
const VB_H = 16000;
const RULES =
  "couleur.fond = craie · accent = terre, un par écran · rayon = 0 · ombre = aucune · dégradé = aucun · titre = Cormorant 300 · texte = Archivo · adresse = vous · ";
const RULE_GAP = 250;
const STEP_DURATION = 1.1; // secondes pour passer d'un service au suivant
const HOLD = 0.45; // pause après chaque passage, le temps de lire avant le geste suivant
const SWIPE = 30; // pixels de glissé au doigt pour changer de service

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
  const rules = useRef<SVGGElement>(null);
  const ticker = useRef<SVGGElement>(null);
  const fills = useRef<(SVGRectElement | null)[]>([]);
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
  const scrollToPhase = useCallback((i: number) => {
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
      duration: STEP_DURATION,
      ease: "power2.inOut",
      onComplete: () => {
        travel.current = gsap.delayedCall(HOLD, () => {
          busy.current = false;
          unhold();
        });
      },
    });
  }, [unhold]);

  const buildTimeline = useCallback(() => {
    const [encre, terre, craie] = fills.current;
    const t = gsap.timeline({ paused: true, defaults: { ease: "none" } });
    t.to(wheel.current, { rotation: -LAST * STEP, duration: LAST }, 0);

    // 01 → 02 : l'encre remplit le totem de bas en haut.
    t.fromTo(encre, { attr: { y: VB_H } }, { attr: { y: 0 }, duration: 0.6, ease: "power3.inOut" }, 0.35);
    t.set(rules.current, { opacity: 1 }, 0.95);
    // 02 → 03 : l'encre se retire vers le haut et découvre les règles.
    t.to(encre, { attr: { y: -VB_H }, duration: 0.6, ease: "power3.inOut" }, 1.35);
    // 03 → 04 : la terre monte.
    t.fromTo(terre, { attr: { y: VB_H } }, { attr: { y: 0 }, duration: 0.6, ease: "power3.inOut" }, 2.35);
    // 04 → 05 : la nuit s'ouvre en cercle depuis le totem, le totem passe en craie.
    t.fromTo(night.current, { clipPath: "circle(0% at 50% 44%)" }, { clipPath: "circle(150% at 50% 44%)", duration: 0.7, ease: "power3.inOut" }, 3.3);
    t.fromTo(craie, { attr: { y: VB_H } }, { attr: { y: 0 }, duration: 0.6, ease: "power3.inOut" }, 3.35);

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

      // Les règles défilent en continu à l'intérieur du totem.
      gsap.to(ticker.current, { y: -RULE_GAP * 2, duration: 6, ease: "none", repeat: -1 });

      trigger.current = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: () => `+=${window.innerHeight * LAST * 0.9}`,
        pin: true,
        scrub: 0.5,
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
        effort += delta;
        if (Math.abs(effort) >= WHEEL_EFFORT) {
          effort = 0;
          afterStep = true;
          handle(dir);
        }
      };

      let startY = 0;
      let dir = 0;
      let held = false;
      let stepped = false;
      const onTouchStart = (e: TouchEvent) => {
        startY = e.touches[0].clientY;
        dir = 0;
        held = false;
        stepped = false;
      };
      const onTouchMove = (e: TouchEvent) => {
        const dy = startY - e.touches[0].clientY;
        if (!dir) {
          if (!dy) return;
          dir = Math.sign(dy);
          held = handle(dir, false);
        }
        if (!held) return;
        if (e.cancelable) e.preventDefault();
        if (!stepped && !busy.current && Math.abs(dy) > SWIPE) {
          stepped = true;
          handle(dir);
        }
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
      window.addEventListener("keydown", onKey);
      const cleanups = [
        () => window.removeEventListener("wheel", onWheel),
        () => window.removeEventListener("touchstart", onTouchStart),
        () => window.removeEventListener("touchmove", onTouchMove),
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
        <svg viewBox={TOTEM_VIEWBOX} role="img" aria-label="Totem Studio Rayas">
          <defs>
            <clipPath id="hero-totem-clip">
              {TOTEM_PATHS.map((d) => (
                <path key={d.slice(0, 24)} d={d} transform={TOTEM_TRANSFORM} />
              ))}
            </clipPath>
          </defs>
          <g clipPath="url(#hero-totem-clip)">
            <g ref={rules} className="hero__rules" style={{ opacity: 0 }}>
              <g ref={ticker}>
                {lines.map((i) => (
                  <text key={i} x={i % 2 ? -1200 : 0} y={260 + i * RULE_GAP} fontSize="190">
                    {RULES.repeat(3)}
                  </text>
                ))}
              </g>
            </g>
            {["encre", "terre", "craie"].map((c, i) => (
              <rect
                key={c}
                ref={(el) => {
                  fills.current[i] = el;
                }}
                x="0"
                y={VB_H}
                width="9000"
                height={VB_H}
                style={{ fill: `var(--sr-color-${c})` }}
              />
            ))}
          </g>
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
