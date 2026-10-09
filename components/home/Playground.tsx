"use client";

import { useId, useMemo, useState } from "react";
import { PLAYGROUND_DEFAULT, PLAYGROUND_RULES, PLAYGROUND_SUGGESTIONS } from "@/content/site";
import { ButtonLink } from "../brand";

interface Hit {
  start: number;
  end: number;
  rule: (typeof PLAYGROUND_RULES)[number];
}

function analyse(text: string): Hit[] {
  const hits: Hit[] = [];
  for (const rule of PLAYGROUND_RULES) {
    for (const m of text.matchAll(new RegExp(rule.pattern.source, rule.pattern.flags))) {
      if (m.index === undefined || !m[0]) continue;
      const start = m.index;
      const end = start + m[0].length;
      if (!hits.some((h) => start < h.end && end > h.start)) hits.push({ start, end, rule });
    }
  }
  return hits.sort((a, b) => a.start - b.start);
}

/** « Essayez » : le lexique du Brand OS Studio Rayas appliqué en direct, dans le navigateur, sans IA. */
export function Playground() {
  const id = useId();
  const [text, setText] = useState(PLAYGROUND_DEFAULT);
  const hits = useMemo(() => analyse(text), [text]);
  const score = Math.max(0, 5 - hits.length);
  const rules = Array.from(new Map(hits.map((h) => [h.rule.id, h.rule])).values());

  const parts: { t: string; bad: boolean }[] = [];
  let at = 0;
  for (const h of hits) {
    if (h.start > at) parts.push({ t: text.slice(at, h.start), bad: false });
    parts.push({ t: text.slice(h.start, h.end), bad: true });
    at = h.end;
  }
  if (at < text.length) parts.push({ t: text.slice(at), bad: false });

  const suggestion = PLAYGROUND_SUGGESTIONS[text.length % PLAYGROUND_SUGGESTIONS.length];

  return (
    <section className="section section--encre" aria-labelledby={`${id}-t`}>
      <div className="container">
        <p className="sr-eyebrow">Essayez</p>
        <h2 id={`${id}-t`} className="title-lg" style={{ marginTop: "var(--sr-space-6)" }}>
          Écrivez une phrase.
          <br />
          Le Brand OS de Studio Rayas la relit.
        </h2>

        <div className="play__field">
          <label className="play__label" htmlFor={`${id}-in`}>
            Votre phrase
          </label>
          <textarea id={`${id}-in`} className="play__input" value={text} onChange={(e) => setText(e.target.value)} spellCheck={false} />
        </div>

        <p className="play__read" aria-hidden="true">
          {parts.map((p, i) => (p.bad ? <mark key={i}>{p.t}</mark> : <span key={i}>{p.t}</span>))}
        </p>

        <div aria-live="polite">
          {rules.length > 0 && (
            <ul className="play__chips">
              {rules.map((r) => (
                <li key={r.id} className="play__chip">
                  « {r.label} »<span>{r.why}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="play__score">
            <strong>{score} / 5</strong>
            <span className="muted" style={{ color: "var(--sr-color-sable)" }}>
              {hits.length === 0
                ? "Aucun écart au Brand OS. Cette phrase peut partir."
                : `${hits.length} écart${hits.length > 1 ? "s" : ""} au Brand OS.`}
            </span>
          </div>
          {hits.length > 0 && (
            <div className="play__suggest">
              <small>La version dans la marque</small>
              <p>« {suggestion} »</p>
            </div>
          )}
        </div>

        <p className="muted" style={{ color: "var(--sr-color-sable)", marginTop: "var(--sr-space-8)", fontSize: "var(--sr-text-sm)" }}>
          Tout se passe dans votre navigateur, sans IA : c&apos;est le lexique du Brand OS, appliqué en direct.
        </p>
        <div style={{ marginTop: "var(--sr-space-6)" }}>
          <ButtonLink href="#contact" size="lg" className="btn-terre">
            Commencer par un diagnostic
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
