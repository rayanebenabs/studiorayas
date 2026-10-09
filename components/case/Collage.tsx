"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import type { Client } from "@/content/clients";
import { Visual } from "./Visual";

/** L'ouverture du cas : le nom en très grand, trois visuels posés à plat qui glissent à des vitesses différentes. */
export function Collage({ client }: { client: Client }) {
  const root = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!root.current || prefersReducedMotion() || window.innerWidth < 900) return;
    const ctx = gsap.context(() => {
      [-60, -110, -30].forEach((y, i) => {
        gsap.to(`.collage__img--${i + 1}`, { y, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
      });
      gsap.from(".collage__name", { yPercent: 30, opacity: 0, duration: 0.4, ease: "power2.out" });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="collage">
      <div className="collage__meta">
        <p className="sr-eyebrow">{client.sector}</p>
        <em>{client.signature}</em>
      </div>
      {client.collage.map((v, i) => (
        <div key={i} className={`collage__img collage__img--${i + 1}`}>
          <Visual v={v} loading="eager" />
        </div>
      ))}
      <h1 className="collage__name" style={{ ["--scale" as string]: client.nameScale }}>
        {client.name}
      </h1>
    </div>
  );
}
