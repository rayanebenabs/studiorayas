"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/brand";

/** Un prompt à lire et à copier en un clic. */
export function PromptBlock({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false);
  const pre = useRef<HTMLPreElement>(null);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Presse-papiers refusé : on sélectionne le texte, prêt pour un Cmd+C.
      const el = pre.current;
      if (el) window.getSelection()?.selectAllChildren(el);
    }
  }

  return (
    <figure className="guide-prompt">
      <figcaption className="guide-prompt__head">
        <span className="sr-eyebrow">{label}</span>
        <Button variant="secondary" size="sm" onClick={copy} aria-live="polite">
          {copied ? "Copié" : "Copier le prompt"}
        </Button>
      </figcaption>
      <pre ref={pre} className="guide-prompt__text">{text}</pre>
    </figure>
  );
}
