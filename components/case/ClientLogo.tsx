import type { ClientSlug } from "@/content/clients";
import { LOGOS } from "@/lib/logos";

/** Le logo vectoriel d'un client, dans la couleur demandée. Rien si le client n'a pas encore de fichier. */
export function ClientLogo({ slug, color, className }: { slug: ClientSlug; color: string; className?: string }) {
  const logo = LOGOS[slug];
  if (!logo) return null;
  return (
    <svg viewBox={logo.viewBox} className={className} role="img" aria-label={logo.label} fillRule="evenodd">
      {logo.paths.map((d) => (
        <path key={d.slice(0, 24)} d={d} fill={color} />
      ))}
    </svg>
  );
}
