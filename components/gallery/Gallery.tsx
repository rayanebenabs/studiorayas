"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as RPointerEvent } from "react";
import { prefersReducedMotion } from "@/lib/gsap";
import { ARTWORKS } from "@/content/gallery";
import type { GalleryHandle } from "./scene";

type Phase = "loading" | "intro" | "walk" | "pause" | "focus" | "no3d";

const STICK = 56; // rayon du joystick tactile, en px

/** La galerie : une salle en 3D que l'on parcourt comme dans un jeu, les œuvres aux murs. */
export function Gallery() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const handle = useRef<GalleryHandle | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [hover, setHover] = useState<number | null>(null);
  const [focus, setFocus] = useState<number | null>(null);
  const [seen, setSeen] = useState<number[]>([]);
  const [touch, setTouch] = useState(false);
  const [knob, setKnob] = useState<{ ox: number; oy: number; x: number; y: number } | null>(null);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  useEffect(() => {
    setTouch(window.matchMedia("(pointer: coarse)").matches);
    const probe = document.createElement("canvas");
    if (!probe.getContext("webgl2") && !probe.getContext("webgl")) {
      setPhase("no3d");
      return;
    }
    let disposed = false;
    (async () => {
      await Promise.all([
        document.fonts.load('300 54px "Cormorant Garamond"'),
        document.fonts.load('400 24px "Archivo"'),
        document.fonts.load('500 22px "Archivo"'),
      ]).catch(() => undefined);
      const { createGallery } = await import("./scene");
      if (disposed || !canvas.current) return;
      handle.current = createGallery(canvas.current, ARTWORKS, {
        onHover: setHover,
        onSeen: (i) => setSeen((s) => (s.includes(i) ? s : [...s, i])),
      });
      setPhase("intro");
    })();
    return () => {
      disposed = true;
      handle.current?.dispose();
      handle.current = null;
    };
  }, []);

  const lock = useCallback(() => {
    if (window.matchMedia("(pointer: fine)").matches) canvas.current?.requestPointerLock?.();
  }, []);

  const enter = () => {
    handle.current?.unfocus();
    handle.current?.setActive(true);
    setFocus(null);
    setPhase("walk");
    lock();
  };

  const leave = () => {
    handle.current?.setActive(false);
    setFocus(null);
    if (document.pointerLockElement) document.exitPointerLock();
    setPhase("intro");
  };

  const openFocus = useCallback((i: number) => {
    handle.current?.focus(i, prefersReducedMotion());
    setFocus(i);
    setPhase("focus");
    if (document.pointerLockElement) document.exitPointerLock();
  }, []);

  // Souris verrouillée : regarder, cliquer sur une œuvre. Échap rend la main.
  useEffect(() => {
    let lockedAt = 0;
    const onMove = (e: MouseEvent) => {
      if (document.pointerLockElement !== canvas.current || performance.now() - lockedAt < 120) return;
      handle.current?.look(e.movementX, e.movementY);
    };
    const onLock = () => {
      if (document.pointerLockElement) lockedAt = performance.now();
      if (!document.pointerLockElement && phaseRef.current === "walk") {
        handle.current?.setActive(false);
        setPhase("pause");
      }
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("pointerlockchange", onLock);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("pointerlockchange", onLock);
    };
  }, []);

  // Au clavier, en face d'une œuvre : flèches pour passer à la suivante, Échap pour reprendre la visite.
  useEffect(() => {
    if (phase !== "focus" || focus === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") openFocus((focus + 1) % ARTWORKS.length);
      else if (e.key === "ArrowLeft") openFocus((focus - 1 + ARTWORKS.length) % ARTWORKS.length);
      else if (e.key === "Escape") enter();
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, focus, openFocus]);

  // Le pointeur sur la scène : clic (souris), joystick à gauche et regard à droite (tactile).
  const drag = useRef<{ id: number; kind: "stick" | "look"; x: number; y: number; t: number; moved: number } | null>(null);
  const stickId = useRef<number | null>(null);
  const stickStart = useRef({ t: 0, moved: 0 });
  const lookId = useRef<{ id: number; x: number; y: number; t: number; moved: number } | null>(null);

  const onDown = (e: RPointerEvent) => {
    if (phase !== "walk") return;
    if (e.pointerType === "mouse") {
      if (document.pointerLockElement === canvas.current) {
        const i = handle.current?.pick() ?? null;
        if (i !== null) openFocus(i);
      } else {
        drag.current = { id: e.pointerId, kind: "look", x: e.clientX, y: e.clientY, t: performance.now(), moved: 0 };
      }
      return;
    }
    (e.target as Element).setPointerCapture?.(e.pointerId);
    if (e.clientX < window.innerWidth * 0.45 && stickId.current === null) {
      stickId.current = e.pointerId;
      stickStart.current = { t: performance.now(), moved: 0 };
      setKnob({ ox: e.clientX, oy: e.clientY, x: 0, y: 0 });
    } else if (!lookId.current) {
      lookId.current = { id: e.pointerId, x: e.clientX, y: e.clientY, t: performance.now(), moved: 0 };
    }
  };

  const onMovePtr = (e: RPointerEvent) => {
    if (phase !== "walk") return;
    if (e.pointerType === "mouse") {
      const d = drag.current;
      if (!d) return;
      handle.current?.look(e.clientX - d.x, e.clientY - d.y, 0.004);
      d.moved += Math.abs(e.clientX - d.x) + Math.abs(e.clientY - d.y);
      d.x = e.clientX;
      d.y = e.clientY;
      return;
    }
    if (e.pointerId === stickId.current && knob) {
      let x = e.clientX - knob.ox;
      let y = e.clientY - knob.oy;
      const len = Math.hypot(x, y);
      if (len > STICK) {
        x = (x / len) * STICK;
        y = (y / len) * STICK;
      }
      stickStart.current.moved = Math.max(stickStart.current.moved, Math.hypot(x, y));
      setKnob({ ...knob, x, y });
      handle.current?.setStick(x / STICK, -y / STICK);
    } else if (lookId.current && e.pointerId === lookId.current.id) {
      const l = lookId.current;
      handle.current?.look(e.clientX - l.x, e.clientY - l.y, 0.005);
      l.moved += Math.abs(e.clientX - l.x) + Math.abs(e.clientY - l.y);
      l.x = e.clientX;
      l.y = e.clientY;
    }
  };

  const onUp = (e: RPointerEvent) => {
    if (e.pointerType === "mouse") {
      const d = drag.current;
      drag.current = null;
      if (d && d.moved < 6 && phase === "walk") {
        const i = handle.current?.pick(e.clientX, e.clientY) ?? null;
        if (i !== null) openFocus(i);
      }
      return;
    }
    if (e.pointerId === stickId.current) {
      stickId.current = null;
      setKnob(null);
      handle.current?.setStick(0, 0);
      // un simple toucher, sans glisser : on vise l'œuvre sous le doigt
      const st = stickStart.current;
      if (st.moved < 10 && performance.now() - st.t < 300 && phase === "walk") {
        const i = handle.current?.pick(e.clientX, e.clientY) ?? null;
        if (i !== null) openFocus(i);
      }
    } else if (lookId.current && e.pointerId === lookId.current.id) {
      const l = lookId.current;
      lookId.current = null;
      if (l.moved < 10 && performance.now() - l.t < 300 && phase === "walk") {
        const i = handle.current?.pick(e.clientX, e.clientY) ?? null;
        if (i !== null) openFocus(i);
      }
    }
  };

  const total = ARTWORKS.length;
  const art = focus !== null ? ARTWORKS[focus] : null;
  const immersive = phase === "walk" || phase === "focus" || phase === "pause";

  return (
    <>
      <section className="gallery" data-immersive={immersive} aria-label="Galerie en 3D">
        <canvas
          ref={canvas}
          className="gallery__canvas"
          data-walk={phase === "walk"}
          onPointerDown={onDown}
          onPointerMove={onMovePtr}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          aria-hidden="true"
        />

        {(phase === "intro" || phase === "loading" || phase === "no3d") && (
          <div className="gallery__intro">
            <div className="gallery__card">
              <p className="sr-eyebrow">Galerie</p>
              <h1 className="title-lg" style={{ marginTop: "var(--sr-space-4)" }}>
                L&apos;œil, en dehors
                <br />
                des commandes.
              </h1>
              <p className="muted" style={{ marginTop: "var(--sr-space-4)" }}>
                Les travaux personnels de Rayane Benabdeljalil, publiés sur Instagram et accrochés dans une salle. Vous la parcourez comme
                dans un jeu.
              </p>
              {phase === "no3d" ? (
                <p style={{ marginTop: "var(--sr-space-6)" }}>Votre navigateur n&apos;affiche pas la 3D. Les œuvres sont listées plus bas.</p>
              ) : (
                <>
                  <ul className="gallery__keys">
                    {touch ? (
                      <>
                        <li><span>Pouce gauche</span> marcher</li>
                        <li><span>Glisser à droite</span> regarder</li>
                        <li><span>Toucher une œuvre</span> s&apos;approcher</li>
                      </>
                    ) : (
                      <>
                        <li><span>ZQSD, WASD ou ↑ ↓</span> marcher</li>
                        <li><span>Souris ou ← →</span> regarder</li>
                        <li><span>Clic sur une œuvre</span> s&apos;approcher</li>
                        <li><span>Échap</span> faire une pause</li>
                      </>
                    )}
                  </ul>
                  <div style={{ display: "flex", gap: "var(--sr-space-3)", flexWrap: "wrap", marginTop: "var(--sr-space-8)" }}>
                    <button type="button" className="sr-btn sr-btn--primary" onClick={enter} disabled={phase === "loading"} aria-busy={phase === "loading" || undefined}>
                      {phase === "loading" ? "La salle se prépare" : "Entrer dans la galerie"}
                    </button>
                    <a className="sr-btn sr-btn--ghost" href="#oeuvres">
                      Voir les œuvres en liste
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {immersive && (
          <div className="gallery__hud">
            <p className="gallery__count" aria-live="polite">
              <strong>{seen.length}</strong> / {total} œuvres vues
            </p>
            <button type="button" className="gallery__exit" onClick={leave}>
              Sortir
            </button>
          </div>
        )}

        {phase === "walk" && !touch && <span className="gallery__dot" data-on={hover !== null} aria-hidden="true" />}
        {phase === "walk" && hover !== null && !touch && (
          <p className="gallery__hint">
            {ARTWORKS[hover].title} · cliquez pour vous approcher
          </p>
        )}
        {phase === "walk" && touch && knob && (
          <span className="gallery__stick" style={{ left: knob.ox, top: knob.oy }} aria-hidden="true">
            <i style={{ transform: `translate(${knob.x}px, ${knob.y}px)` }} />
          </span>
        )}

        {phase === "pause" && (
          <div className="gallery__intro">
            <div className="gallery__card">
              <p className="sr-eyebrow">Visite en pause</p>
              <p className="title-md" style={{ marginTop: "var(--sr-space-4)" }}>
                {seen.length === total ? "Vous avez vu toutes les œuvres." : `Encore ${total - seen.length} œuvre${total - seen.length > 1 ? "s" : ""} à voir.`}
              </p>
              <div style={{ display: "flex", gap: "var(--sr-space-3)", flexWrap: "wrap", marginTop: "var(--sr-space-6)" }}>
                <button type="button" className="sr-btn sr-btn--primary" onClick={enter}>
                  Reprendre la visite
                </button>
                <button type="button" className="sr-btn sr-btn--ghost" onClick={leave}>
                  Sortir de la galerie
                </button>
              </div>
            </div>
          </div>
        )}

        {phase === "focus" && art && focus !== null && (
          <aside className="gallery__panel" aria-live="polite">
            <p className="sr-eyebrow">
              {String(focus + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </p>
            <h2 className="title-md" style={{ marginTop: "var(--sr-space-2)" }}>
              {art.title}
            </h2>
            <p className="muted" style={{ marginTop: "var(--sr-space-1)" }}>
              {art.src ? [art.year, art.technique].filter(Boolean).join(" · ") : "Bientôt accrochée"}
            </p>
            {art.instagram && (
              <a className="gallery__ig" href={art.instagram} target="_blank" rel="noreferrer">
                Voir la publication sur Instagram
              </a>
            )}
            <div className="gallery__nav">
              <button type="button" className="sr-btn sr-btn--ghost sr-btn--sm" onClick={() => openFocus((focus - 1 + total) % total)} aria-label="Œuvre précédente">
                ←
              </button>
              <button type="button" className="sr-btn sr-btn--ghost sr-btn--sm" onClick={() => openFocus((focus + 1) % total)} aria-label="Œuvre suivante">
                →
              </button>
              <button type="button" className="sr-btn sr-btn--primary sr-btn--sm" onClick={enter}>
                Reprendre la visite
              </button>
            </div>
          </aside>
        )}
      </section>

      <section className="section" id="oeuvres" aria-labelledby="oeuvres-t">
        <div className="container">
          <p className="sr-eyebrow">En liste</p>
          <h2 id="oeuvres-t" className="title-lg" style={{ marginTop: "var(--sr-space-4)" }}>
            Les œuvres de la salle.
          </h2>
          <ol className="gallery-list">
            {ARTWORKS.map((a, i) => (
              <li key={i}>
                <div className="gallery-list__media">{a.src ? <img src={a.src} alt={a.title} loading="lazy" /> : null}</div>
                <p className="gallery-list__n">{String(i + 1).padStart(2, "0")}</p>
                <p className="gallery-list__title">{a.title}</p>
                <p className="muted">{a.src ? [a.year, a.technique].filter(Boolean).join(" · ") : "Bientôt accrochée"}</p>
                {a.instagram && (
                  <a href={a.instagram} target="_blank" rel="noreferrer">
                    Instagram
                  </a>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
