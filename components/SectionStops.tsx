"use client";

import { useEffect } from "react";
import { gsap, prefersReducedMotion, WHEEL_EFFORT, WHEEL_RESET } from "@/lib/gsap";

const ARRIVE = 0.5; // secondes pour se poser en haut d'une section

/**
 * Un arrêt en haut de chaque section de la page d'accueil (hors hero, qui a ses propres arrêts).
 * La molette se pose sur le début de la section, puis demande un petit effort pour repartir.
 */
export function SectionStops() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    // Le haut de chaque section, mesuré sur son espaceur quand elle est épinglée.
    const stops = () =>
      Array.from(document.querySelectorAll<HTMLElement>("main > section, main > .pin-spacer > section"))
        .slice(1)
        .map((s) => {
          const box = s.parentElement?.classList.contains("pin-spacer") ? s.parentElement : s;
          return Math.round(box.getBoundingClientRect().top + window.scrollY);
        });

    let busy = false;
    let tween: gsap.core.Tween | null = null;
    let lastWheel = 0;
    let lastDelta = 0;
    let effort = 0;
    let afterStop = false;

    const onWheel = (e: WheelEvent) => {
      if (e.defaultPrevented || e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
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
      const all = stops();

      // Posé sur un arrêt : il faut cumuler un peu de molette pour repartir.
      if (all.some((s) => Math.abs(y - s) < 2)) {
        if (afterStop && tail) {
          e.preventDefault();
          return;
        }
        afterStop = false;
        effort += delta;
        if (Math.abs(effort) >= WHEEL_EFFORT) {
          effort = 0;
          return; // ce cran-là fait déjà défiler la page
        }
        e.preventDefault();
        return;
      }

      // Le cran franchirait le haut d'une section : on s'y pose.
      const stop = all.find((s) => (dir > 0 ? y < s && y + delta >= s : y > s && y + delta <= s));
      if (stop === undefined) return;
      e.preventDefault();
      busy = true;
      effort = 0;
      afterStop = true;
      tween = gsap.to(window, {
        scrollTo: { y: stop, autoKill: false },
        duration: ARRIVE,
        ease: "power2.out",
        onComplete: () => {
          busy = false;
        },
      });
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      tween?.kill();
    };
  }, []);

  return null;
}
