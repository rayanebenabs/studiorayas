"use client";

import { useEffect } from "react";
import { ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { addSettler, cutMomentum, isSmoothing, pickRest, settle, startSmoothScroll } from "@/lib/scroll";

const IDLE = 140; // millisecondes sans mouvement : la page est immobile
const NEAR = 0.22; // part de l'écran sous laquelle on se pose sur le haut d'une section
const SHORT = 1.1; // un intervalle plus court que ça (en hauteurs d'écran) se lit en entier : la page s'y pose
const MOMENTUM = 2500; // durée maximale de l'élan après un lancer du doigt (ms)

/**
 * Le défilement de la page d'accueil.
 * - Molette lissée (Lenis), jamais bloquée.
 * - Page immobile : elle se pose sur un service dans le hero, une étape dans le schéma, une section entière
 *   quand elle tient dans l'écran, ou le haut d'une section longue quand on s'est arrêté tout près.
 * - Au doigt, l'élan d'un lancer s'arrête net sur chaque moment de la page : le haut d'une section,
 *   le début ou la fin d'une animation épinglée. Tant que le doigt est posé, il garde la main.
 */
export function ScrollFlow() {
  useEffect(() => {
    const stopSmooth = startSmoothScroll();
    if (prefersReducedMotion()) return stopSmooth;

    // Les moments de la page, mesurés une fois puis à chaque recalcul de ScrollTrigger.
    let tops: number[] = []; // haut de chaque section (hors hero)
    let moments: number[] = []; // les mêmes, plus la fin de chaque section épinglée
    const measure = () => {
      const sections = Array.from(document.querySelectorAll<HTMLElement>("main > section, main > .pin-spacer > section"));
      const pageY = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY;
      tops = sections.slice(1).map((s) => Math.round(pageY(s.parentElement?.classList.contains("pin-spacer") ? s.parentElement : s)));
      const ends = sections
        .filter((s) => s.parentElement?.classList.contains("pin-spacer"))
        .map((s) => {
          const spacer = s.parentElement as HTMLElement;
          return Math.round(pageY(spacer) + spacer.offsetHeight - s.offsetHeight);
        });
      moments = [...tops, ...ends].sort((a, b) => a - b);
    };
    measure();
    ScrollTrigger.addEventListener("refresh", measure);

    // Règle de calage des sections : s'arrêter tout près d'un haut de section, c'est s'y poser.
    // Règle de calage des sections. Entre deux moments rapprochés (une section qui tient dans l'écran,
    // la sortie d'une animation épinglée), la page se pose sur l'un des deux ; dans une section longue,
    // elle reste libre pour la lecture, sauf tout près d'un haut de section.
    const removeSettler = addSettler((direction, y) => {
      const i = moments.findIndex((m) => m > y);
      if (i > 0 && moments[i] - moments[i - 1] <= window.innerHeight * SHORT) {
        return pickRest([moments[i - 1], moments[i]], y, direction);
      }
      return tops.find((s) => Math.abs(y - s) < window.innerHeight * NEAR);
    });

    let fingerDown = false;
    let swiped = false; // le dernier geste au doigt a fait défiler la page (pas un tap, pas le hero)
    let liftedAt = 0;
    let lastY = window.scrollY;
    let direction = 0;
    let idle = 0;

    const onTouchStart = () => {
      fingerDown = true;
      swiped = false;
    };
    // Un glissé que le hero garde pour lui (il le bloque) n'est pas un défilement de la page.
    const onTouchMove = (e: TouchEvent) => {
      if (!e.defaultPrevented) swiped = true;
    };
    const onTouchEnd = () => {
      fingerDown = false;
      liftedAt = performance.now();
      onScroll();
    };

    const onScroll = () => {
      const y = window.scrollY;
      const prev = lastY;
      lastY = y;
      if (y !== prev) direction = Math.sign(y - prev);

      // Élan d'un lancer : il s'arrête net sur le premier moment franchi.
      if (!fingerDown && swiped && performance.now() - liftedAt < MOMENTUM && y !== prev) {
        const crossed = moments.find((m) => (y > prev ? prev < m && y >= m : prev > m && y <= m));
        if (crossed !== undefined) {
          swiped = false;
          lastY = crossed;
          cutMomentum(crossed);
          return;
        }
      }

      // Page immobile : elle se pose. À la molette, Lenis s'en charge dès la fin du geste.
      window.clearTimeout(idle);
      idle = window.setTimeout(() => {
        if (!fingerDown && !isSmoothing()) settle(direction);
      }, IDLE);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      ScrollTrigger.removeEventListener("refresh", measure);
      window.clearTimeout(idle);
      removeSettler();
      stopSmooth();
    };
  }, []);

  return null;
}
