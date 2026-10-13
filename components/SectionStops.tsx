"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger, passWheel, prefersReducedMotion, scrollLock, WHEEL_EFFORT, WHEEL_RESET } from "@/lib/gsap";

const ARRIVE = 0.5; // secondes pour se poser en haut d'une section

const TOUCH_HOLD = 350; // millisecondes d'arrêt au doigt, une fois le doigt levé

/**
 * Un arrêt en haut de chaque section de la page d'accueil (hors hero, qui a ses propres arrêts).
 * La molette se pose sur le début de la section, puis demande un petit effort pour repartir.
 * Au doigt, l'élan s'annule dès qu'il atteint un moment de la page : le haut d'une section,
 * le début ou la fin d'une animation épinglée (le hero compris). Le geste suivant repart librement.
 */
export function SectionStops() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    // Le haut de chaque section, mesuré sur son espaceur quand elle est épinglée.
    const measureStops = () =>
      Array.from(document.querySelectorAll<HTMLElement>("main > section, main > .pin-spacer > section"))
        .slice(1)
        .map((s) => {
          const box = s.parentElement?.classList.contains("pin-spacer") ? s.parentElement : s;
          return Math.round(box.getBoundingClientRect().top + window.scrollY);
        });

    // Au doigt : les hauts de section, plus la fin de chaque section épinglée (fin de son animation).
    const measureTouchStops = () => {
      const out = measureStops();
      document.querySelectorAll<HTMLElement>("main > .pin-spacer > section").forEach((sec) => {
        const spacer = sec.parentElement as HTMLElement;
        const top = spacer.getBoundingClientRect().top + window.scrollY;
        out.push(Math.round(top + spacer.offsetHeight - sec.offsetHeight));
      });
      return out;
    };

    // Les positions sont mesurées une fois, puis à chaque recalcul de ScrollTrigger (redimensionnement,
    // chargement) : rien n'est lu dans la page pendant le défilement.
    let stops: number[] = [];
    let touchStops: number[] = [];
    const measure = () => {
      stops = measureStops();
      touchStops = measureTouchStops();
    };
    measure();
    ScrollTrigger.addEventListener("refresh", measure);

    let busy = false;
    let tween: gsap.core.Tween | null = null;
    let lastWheel = 0;
    let lastDelta = 0;
    let effort = 0;
    let afterStop = false;

    const onWheel = (e: WheelEvent) => {
      if (e.defaultPrevented || e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      scrollLock.wheel();
      touching = false;
      const now = performance.now();
      const delta = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      const d = Math.abs(delta);
      if (d < 1) return;
      const dir = Math.sign(delta);
      if (now - lastWheel > WHEEL_RESET || Math.sign(effort) !== dir) effort = 0;
      // La traîne d'élan d'un pavé tactile ne compte pas comme un nouveau geste.
      const tail = now - lastWheel < 150 && d <= lastDelta * 1.2;
      lastWheel = now;
      lastDelta = d;

      if (busy) {
        e.preventDefault();
        return;
      }
      const y = window.scrollY;

      // Posé sur un arrêt : il faut cumuler un peu de molette pour repartir.
      if (stops.some((s) => Math.abs(y - s) < 2)) {
        if (afterStop && tail) {
          e.preventDefault();
          return;
        }
        afterStop = false;
        effort += delta;
        if (Math.abs(effort) >= WHEEL_EFFORT) {
          effort = 0;
          passWheel(e, delta); // ce cran-là fait déjà défiler la page
          return;
        }
        e.preventDefault();
        return;
      }

      // Le cran franchirait le haut d'une section : on s'y pose.
      const stop = stops.find((s) => (dir > 0 ? y < s && y + delta >= s : y > s && y + delta <= s));
      if (stop === undefined) return;
      e.preventDefault();
      busy = true;
      effort = 0;
      afterStop = true;
      scrollLock.hold();
      tween = gsap.to(window, {
        scrollTo: { y: stop, autoKill: false },
        duration: ARRIVE,
        ease: "power2.out",
        onComplete: () => {
          busy = false;
          scrollLock.release();
        },
      });
    };

    let touching = false; // le dernier défilement vient d'un glissé (pas d'un tap sur un lien du menu)
    let fingerDown = false;
    let held = false;
    let lastY = window.scrollY;
    let holdTimer = 0;
    const releaseTouch = () => {
      window.clearTimeout(holdTimer);
      if (fingerDown) return; // on relâche quand le doigt se lève
      holdTimer = window.setTimeout(() => {
        if (!held) return;
        held = false;
        lastY = window.scrollY;
        scrollLock.release();
      }, TOUCH_HOLD);
    };
    const onTouchStart = () => {
      touching = false;
      fingerDown = true;
      window.clearTimeout(holdTimer);
    };
    // Un glissé que le hero garde pour lui (il le bloque) n'est pas un défilement de la page.
    const onTouchMove = (e: TouchEvent) => {
      if (!e.defaultPrevented) touching = true;
    };
    const onTouchEnd = () => {
      fingerDown = false;
      if (held) releaseTouch();
    };
    const onScroll = () => {
      const y = window.scrollY;
      const prev = lastY;
      lastY = y;
      if (!touching || held || busy) return;
      // Un moment franchi pendant ce défilement : on coupe l'élan et on se pose dessus.
      const stop = touchStops.find((s) => (y > prev ? prev < s && y >= s : prev > s && y <= s));
      if (stop === undefined) return;
      held = true;
      scrollLock.hold(); // le verrou coupe l'élan du doigt (iOS comme Android)
      window.scrollTo({ top: stop, behavior: "instant" });
      lastY = stop;
      releaseTouch();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      ScrollTrigger.removeEventListener("refresh", measure);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(holdTimer);
      if (busy) scrollLock.release();
      if (held) scrollLock.release();
      tween?.kill();
    };
  }, []);

  return null;
}
