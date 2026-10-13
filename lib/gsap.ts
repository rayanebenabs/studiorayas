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
