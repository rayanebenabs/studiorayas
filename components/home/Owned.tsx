"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/gsap";
import { OWNED } from "@/content/site";
import { Reveal } from "../Reveal";

/** « Il vous appartient » : la phrase s'écrit lettre après lettre quand la section arrive. */
export function Owned() {
  const ref = useRef<HTMLParagraphElement>(null);
  const [count, setCount] = useState(0);
  const total = OWNED.line.length;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      setCount(total);
      return;
    }
    let timer: number | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        let n = 0;
        timer = window.setInterval(() => {
          n += 1;
          setCount(n);
          if (n >= total) window.clearInterval(timer);
        }, 28);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer) window.clearInterval(timer);
    };
  }, [total]);

  return (
    <Reveal as="section" className="section section--encre">
      <div className="container">
        <p className="sr-eyebrow">Il vous appartient</p>
        <p ref={ref} className="owned__line" aria-label={OWNED.line}>
          <span aria-hidden="true">{OWNED.line.slice(0, count)}</span>
          <span className="owned__cursor" aria-hidden="true" />
        </p>
        <div className="grid-3" style={{ marginTop: "var(--sr-space-16)" }}>
          {OWNED.points.map((p) => (
            <div key={p.title} className="point" data-reveal>
              <h3 className="point__title" style={{ marginTop: 0 }}>{p.title}</h3>
              <p className="point__text">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
