"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { addSettler, pickRest } from "@/lib/scroll";
import { MANIFESTO } from "@/content/site";

/** Le manifeste s'allume mot par mot au rythme du défilement. */
export function Manifesto() {
  const root = useRef<HTMLElement>(null);
  const words = MANIFESTO.split(" ");

  useLayoutEffect(() => {
    if (!root.current) return;
    if (prefersReducedMotion()) {
      gsap.set(root.current.querySelectorAll(".manifesto__word"), { opacity: 1 });
      return;
    }
    let removeSettler = () => undefined as unknown;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top top", end: "+=140%", pin: true, scrub: 0.3 },
      });
      // Page immobile : le manifeste se pose allumé en entier, ou pas du tout.
      const st = tl.scrollTrigger!;
      removeSettler = addSettler((direction, y) =>
        y < st.start - 2 || y > st.end + 2 ? undefined : pickRest([st.start, st.end], y, direction, 0.15),
      );
      tl.to(".manifesto__word", { opacity: 1, stagger: 0.1, ease: "none", duration: 0.3 }, 0);
      tl.to(".manifesto__bar span", { scaleX: 1, ease: "none", duration: tl.duration() }, 0);
    }, root);
    return () => {
      removeSettler();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} className="manifesto section--papier" aria-label="Manifeste">
      <div className="container">
        <p className="sr-eyebrow">Le Brand OS</p>
        <p className="manifesto__text">
          {words.map((w, i) => (
            <span key={i} className="manifesto__word">
              {w}
              {i < words.length - 1 ? " " : ""}
            </span>
          ))}
        </p>
        <div className="manifesto__bar" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  );
}
