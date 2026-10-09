"use client";

import Link from "next/link";
import { useRef, useState, type MouseEvent } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { CLIENTS } from "@/content/clients";

/** L'index des travaux. Au survol, un visuel du cas suit le curseur, posé à plat. */
export function Work() {
  const preview = useRef<HTMLDivElement>(null);
  const [img, setImg] = useState<string | null>(null);

  const move = (e: MouseEvent) => {
    if (!preview.current || prefersReducedMotion()) return;
    gsap.to(preview.current, { x: e.clientX + 24, y: e.clientY - 160, duration: 0.2, ease: "power2.out" });
  };
  const show = (src?: string) => {
    if (!preview.current || !src) return;
    setImg(src);
    gsap.to(preview.current, { opacity: 1, duration: 0.15 });
  };
  const hide = () => preview.current && gsap.to(preview.current, { opacity: 0, duration: 0.15 });

  return (
    <section className="section" id="travaux" aria-labelledby="travaux-t" onMouseMove={move}>
      <div className="container">
        <p className="sr-eyebrow">Travaux</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "var(--sr-space-8)", flexWrap: "wrap", marginTop: "var(--sr-space-6)" }}>
          <h2 id="travaux-t" className="title-lg">
            Quatre marques,
            <br />
            quatre systèmes.
          </h2>
          <p className="muted" style={{ maxWidth: "22em" }}>
            Sur chaque cas : le branding, la charte, et un brand-check à jouer.
          </p>
        </div>
        <ol className="work">
          {CLIENTS.map((c, i) => (
            <li key={c.slug} className="work__row">
              <Link
                href={`/travaux/${c.slug}/`}
                className="work__link"
                onMouseEnter={() => show(c.collage[0].src)}
                onMouseLeave={hide}
                onFocus={() => show(c.collage[0].src)}
                onBlur={hide}
              >
                <span className="work__n">0{i + 1}</span>
                <span className="work__name">{c.name}</span>
                <span className="work__meta">
                  {c.sector}
                  <span>{c.deliverables}</span>
                </span>
                <span className="work__go">Voir le cas →</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
      <div ref={preview} className="work__preview" aria-hidden="true">
        {img && <img src={img} alt="" />}
      </div>
    </section>
  );
}
