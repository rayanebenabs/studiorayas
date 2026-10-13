"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

export { gsap, ScrollTrigger };

/** Vrai si le visiteur a demandé moins de mouvement. */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Distance de molette à cumuler pour franchir un arrêt (environ deux crans). */
export const WHEEL_EFFORT = 180;
/** Millisecondes sans molette avant que l'effort cumulé ne retombe. */
export const WHEEL_RESET = 400;

/**
 * Verrou du défilement pendant un arrêt (service du hero, haut de section).
 * Chrome ne laisse plus annuler la suite d'un geste de pavé tactile une fois qu'il a commencé à défiler :
 * sans verrou, le défilement natif se bat avec l'arrêt et la page tremble au lancement de l'animation.
 * Le verrou tient tant qu'un arrêt est en cours, puis jusqu'à la fin du geste de molette.
 */
let holders = 0;
let lastWheel = 0;
let idle = 0;
const lockRoot = () => document.documentElement;
const settle = () => {
  window.clearTimeout(idle);
  if (holders > 0) return;
  const wait = WHEEL_RESET - (performance.now() - lastWheel);
  if (wait <= 0) lockRoot().classList.remove("is-scroll-locked");
  else idle = window.setTimeout(settle, wait);
};
export const scrollLock = {
  hold() {
    holders++;
    lockRoot().classList.add("is-scroll-locked");
  },
  release() {
    holders = Math.max(0, holders - 1);
    settle();
  },
  /** À appeler à chaque événement de molette, pour savoir quand le geste est fini. */
  wheel() {
    lastWheel = performance.now();
    if (lockRoot().classList.contains("is-scroll-locked")) settle();
  },
  /** Libère tout de suite (l'effort pour repartir est fourni) et fait défiler ce cran, que le verrou aurait avalé. */
  free(delta = 0) {
    const locked = lockRoot().classList.contains("is-scroll-locked");
    holders = 0;
    lastWheel = 0;
    settle();
    if (locked && delta) window.scrollBy(0, delta);
  },
};
