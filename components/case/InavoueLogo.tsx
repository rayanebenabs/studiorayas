import { INAVOUE_PATHS, INAVOUE_VIEWBOX } from "@/lib/inavoue-logo";

export function InavoueLogo({ color, className }: { color: string; className?: string }) {
  return (
    <svg viewBox={INAVOUE_VIEWBOX} className={className} role="img" aria-label="l'inavoué">
      {INAVOUE_PATHS.map((d) => (
        <path key={d.slice(0, 24)} d={d} fill={color} />
      ))}
    </svg>
  );
}
