"use client";

import { useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { USAGES } from "@/content/site";
import { Totem } from "../Totem";

/** « Une marque, tous ceux qui la font » : un onglet par public, des cartes qui glissent. */
export function Usages() {
  const [tab, setTab] = useState(USAGES.length - 1);
  const cards = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const first = useRef(true);

  useLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!cards.current || prefersReducedMotion()) return;
    gsap.fromTo(cards.current.children, { opacity: 0, x: 32 }, { opacity: 1, x: 0, duration: 0.2, stagger: 0.06, ease: "power2.out" });
  }, [tab]);

  const onKey = (e: KeyboardEvent) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    const next = (tab + d + USAGES.length) % USAGES.length;
    setTab(next);
    tabs.current[next]?.focus();
  };

  return (
    <section className="section" aria-labelledby="usages-title">
      <div className="container">
        <p className="sr-eyebrow">Une marque, tous ceux qui la font</p>
        <h2 id="usages-title" className="title-lg" style={{ marginTop: "var(--sr-space-6)", maxWidth: "22em" }}>
          Les mêmes règles, pour chaque personne et chaque outil qui touche à votre marque.
        </h2>
        <div className="tabs" role="tablist" aria-label="Pour qui" onKeyDown={onKey}>
          {USAGES.map((u, i) => (
            <button
              key={u.tab}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`tab-${i}`}
              aria-selected={i === tab}
              aria-controls="usage-panel"
              tabIndex={i === tab ? 0 : -1}
              className="tab"
              onClick={() => setTab(i)}
            >
              {u.tab}
            </button>
          ))}
        </div>
        <div ref={cards} id="usage-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="usage-cards">
          {USAGES[tab].cards.map((c) => (
            <article key={c.title} className="usage-card">
              <div className={`usage-card__media${c.dark ? " usage-card__media--dark" : ""}`}>
                {c.dark ? <Totem /> : c.image ? <img src={c.image} alt="" loading="lazy" /> : null}
              </div>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
