"use client";

import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "./gsap";

/**
 * Le défilement du site.
 *
 * - Lenis lisse la molette et le pavé tactile ; au doigt, le défilement reste celui du téléphone.
 * - Rien ne bloque la main du visiteur : un nouveau geste reprend toujours le dessus sur une animation.
 * - Quand la page s'immobilise, elle se pose : sur un service dans le hero, sur le haut d'une section
 *   quand on s'est arrêté tout près (voir components/ScrollFlow.tsx).
 */

let lenis: Lenis | null = null;

const WHEEL_IDLE = 150; // millisecondes sans molette : le geste est fini, on vise la destination de Lenis
let wheelIdle = 0;
let wheelDirection = 0;

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const raf = (time: number) => lenis?.raf(time * 1000);

/** Démarre le défilement lissé. Renvoie de quoi l'arrêter. */
export function startSmoothScroll() {
  if (lenis || prefersReducedMotion()) return () => undefined;
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.9, smoothWheel: true, syncTouch: false, anchors: true });
  lenis.on("scroll", ScrollTrigger.update);
  // Molette : dès que le geste s'arrête, la page file vers sa position de repos, sans attendre la fin du lissage.
  lenis.on("virtual-scroll", ({ deltaY, event }) => {
    if (!event.type.includes("wheel") || !deltaY) return;
    wheelDirection = Math.sign(deltaY);
    window.clearTimeout(wheelIdle);
    wheelIdle = window.setTimeout(() => lenis && settle(wheelDirection, lenis.targetScroll, true), WHEEL_IDLE);
  });
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);
  return () => {
    window.clearTimeout(wheelIdle);
    gsap.ticker.remove(raf);
    lenis?.destroy();
    lenis = null;
  };
}

/** Vrai pendant que Lenis lisse un geste de molette : la molette se pose elle-même à la fin. */
export const isSmoothing = () => lenis?.isScrolling === "smooth";

/** Amène la page à une position, en douceur. Un geste du visiteur l'interrompt. */
export function scrollToY(
  y: number,
  { duration = 0.8, glide = false, onComplete }: { duration?: number; glide?: boolean; onComplete?: () => void } = {},
) {
  if (lenis) {
    // glide : la molette continue sur son élan jusqu'au repos ; sinon, une courbe douce de durée fixe.
    const motion = glide ? { lerp: 0.09 } : { duration, easing: easeInOut };
    lenis.scrollTo(y, { ...motion, force: true, userData: { auto: true }, onComplete: () => onComplete?.() });
  } else {
    window.scrollTo({ top: y, behavior: prefersReducedMotion() ? "instant" : "smooth" });
    onComplete?.();
  }
}
/** Place la page immédiatement (le doigt qui tire le hero), en gardant Lenis synchronisé. */
export function jumpToY(y: number) {
  if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
  else window.scrollTo({ top: y, behavior: "instant" });
}

/** Fige la page (menu ouvert) ou la rend. */
export function holdPage(on: boolean) {
  if (lenis) {
    if (on) lenis.stop();
    else lenis.start();
  }
  document.documentElement.classList.toggle("is-scroll-locked", on);
}

/** Coupe l'élan du doigt : la page s'arrête net, puis le défilement est rendu. */
export function cutMomentum(y: number, release = 220) {
  const root = document.documentElement;
  root.classList.add("is-scroll-locked");
  jumpToY(y);
  window.setTimeout(() => root.classList.remove("is-scroll-locked"), release);
}

// Les règles de calage : où la page doit se poser quand elle s'immobilise (le hero, les animations, les sections).
// Chacune renvoie undefined si la position ne la concerne pas, null si la page est déjà posée, ou la position visée.
type Settler = (direction: number, y: number) => number | null | undefined;
const settlers: Settler[] = [];

/** Ajoute une règle de calage, consultée dans l'ordre. */
export function addSettler(fn: Settler, first = false) {
  if (first) settlers.unshift(fn);
  else settlers.push(fn);
  return () => {
    const i = settlers.indexOf(fn);
    if (i >= 0) settlers.splice(i, 1);
  };
}

/** La page s'immobilise (ou la molette s'arrête, y étant alors sa destination) : la première règle concernée la pose. */
export function settle(direction: number, y = window.scrollY, glide = false) {
  if (lenis?.userData?.auto) return; // une animation de calage est déjà en route
  for (const fn of settlers) {
    const target = fn(direction, y);
    if (target === undefined) continue;
    if (target === null || Math.abs(target - y) < 2) return;
    const distance = Math.abs(target - window.scrollY) / window.innerHeight;
    scrollToY(target, { glide, duration: Math.min(1.1, 0.35 + distance * 0.7) });
    return;
  }
}

/**
 * Choisit où se poser entre des positions de repos triées (services, étapes, début et fin d'une animation).
 * Dans le sens du geste, il suffit d'avoir franchi `intent` de l'intervalle pour aller au repos suivant.
 * Renvoie null si la page est déjà posée, ou hors des positions.
 */
export function pickRest(points: number[], y: number, direction: number, intent = 0.2) {
  if (points.length < 2 || y < points[0] - 2 || y > points[points.length - 1] + 2) return null;
  if (points.some((p) => Math.abs(p - y) <= 2)) return null;
  const i = points.findIndex((p) => p > y);
  const lo = points[i - 1];
  const hi = points[i];
  const frac = (y - lo) / (hi - lo);
  if (direction > 0) return frac > intent ? hi : lo;
  if (direction < 0) return frac < 1 - intent ? lo : hi;
  return frac < 0.5 ? lo : hi;
}
