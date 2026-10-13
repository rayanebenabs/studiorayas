"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { holdPage } from "@/lib/scroll";

type Item = { href: string; label: string; route?: boolean };

/** Le menu sur mobile : un bouton à deux filets, un panneau plein écran sur la craie. */
export function MobileMenu({ items, cta }: { items: Item[]; cta: Item }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    holdPage(true);
    panel.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      holdPage(false);
    };
  }, [open]);

  const close = (refocus = true) => {
    setOpen(false);
    holdPage(false); // tout de suite : le lien suivi peut faire défiler la page
    if (refocus) button.current?.focus();
  };

  return (
    <>
      <button
        ref={button}
        type="button"
        className="menu-button"
        aria-expanded={open}
        aria-controls="menu-mobile"
        onClick={() => (open ? close() : setOpen(true))}
      >
        <span className="menu-button__lines" aria-hidden="true">
          <i />
          <i />
        </span>
        Menu
      </button>
      {mounted &&
        createPortal(
          <div ref={panel} id="menu-mobile" className="menu-panel" data-open={open} aria-hidden={!open} inert={!open}>
            <div className="menu-panel__top">
              <p className="sr-eyebrow">Studio Rayas</p>
              <button type="button" className="menu-button" onClick={() => close()}>
                <span className="menu-button__lines" data-close="true" aria-hidden="true">
                  <i />
                  <i />
                </span>
                Fermer
              </button>
            </div>
            <nav aria-label="Navigation mobile">
              <ul className="menu-panel__links">
                {items.map((it, i) => (
                  <li key={it.href} style={{ ["--i" as string]: i }}>
                    {it.route ? (
                      <Link href={it.href} onClick={() => close(false)}>
                        {it.label}
                      </Link>
                    ) : (
                      <a href={it.href} onClick={() => close(false)}>
                        {it.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            <a className="sr-btn sr-btn--primary sr-btn--lg menu-panel__cta" href={cta.href} onClick={() => close(false)}>
              {cta.label}
            </a>
          </div>,
          document.body,
        )}
    </>
  );
}
