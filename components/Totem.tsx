import { useId } from "react";
import { TOTEM_PATHS, TOTEM_TRANSFORM, TOTEM_VIEWBOX } from "@/lib/totem";

export type TotemMode = "trait" | "plein" | "regles";

const RULES =
  "couleur.fond = craie · accent = terre, un par écran · rayon = 0 · ombre = aucune · dégradé = aucun · titre = Cormorant 300 · texte = Archivo · adresse = vous · ";

interface TotemProps {
  mode?: TotemMode;
  className?: string;
  title?: string;
}

/** Le totem Rayas, à la verticale. La couleur suit `currentColor`. */
export function Totem({ mode = "plein", className, title }: TotemProps) {
  const id = useId().replace(/:/g, "");
  const label = title ? { role: "img", "aria-label": title } : { "aria-hidden": true };

  if (mode === "regles") {
    const lines = Array.from({ length: 64 }, (_, i) => i);
    return (
      <svg viewBox={TOTEM_VIEWBOX} className={className} {...label}>
        <defs>
          <clipPath id={`clip-${id}`}>
            {TOTEM_PATHS.map((d) => (
              <path key={d.slice(0, 24)} d={d} transform={TOTEM_TRANSFORM} />
            ))}
          </clipPath>
        </defs>
        <g clipPath={`url(#clip-${id})`}>
          {lines.map((i) => (
            <text
              key={i}
              x={i % 2 ? -1200 : 0}
              y={260 + i * 250}
              fontSize="190"
              fill="currentColor"
              style={{ fontFamily: "var(--sr-font-body)" }}
            >
              {RULES.repeat(3)}
            </text>
          ))}
        </g>
        <g transform={TOTEM_TRANSFORM} fill="none" stroke="currentColor" strokeWidth="40">
          {TOTEM_PATHS.map((d) => (
            <path key={d.slice(0, 24)} d={d} />
          ))}
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox={TOTEM_VIEWBOX} className={className} {...label}>
      <g
        transform={TOTEM_TRANSFORM}
        fill={mode === "plein" ? "currentColor" : "none"}
        stroke={mode === "trait" ? "currentColor" : "none"}
        strokeWidth={mode === "trait" ? 45 : 0}
      >
        {TOTEM_PATHS.map((d) => (
          <path key={d.slice(0, 24)} d={d} />
        ))}
      </g>
    </svg>
  );
}
