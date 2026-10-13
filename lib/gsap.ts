"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

/** Vrai si le visiteur a demandé moins de mouvement. */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Vrai sur un écran tactile (le doigt pilote le défilement, pas une molette). */
export const isTouch = () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
