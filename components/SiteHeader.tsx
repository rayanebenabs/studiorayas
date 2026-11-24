import Link from "next/link";
import { Totem } from "./Totem";
import { MobileMenu } from "./MobileMenu";

/** Le menu ne mène qu'à des pages. Chaque sujet a une seule adresse. */
export const NAV = [
  { href: "/methode/", label: "Méthode" },
  { href: "/travaux/", label: "Travaux" },
  { href: "/studio/", label: "Studio" },
  { href: "/galerie/", label: "Galerie" },
];

/**
 * `contact` : la page se termine par le bloc de contact, le bouton y descend.
 * Sinon (galerie, guide), il mène au contact de la page Studio.
 */
export function SiteHeader({ contact = true }: { home?: boolean; contact?: boolean }) {
  const cta = { href: contact ? "#contact" : "/studio/#contact", label: "Commencer par un diagnostic" };
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="site-header__brand">
          <Totem />
          <span>Studio Rayas</span>
        </Link>
        <nav aria-label="Navigation principale">
          <ul className="site-header__links">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href}>{n.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <a className="site-header__cta" href={cta.href}>
          {cta.label}
        </a>
        <MobileMenu items={NAV.map((n) => ({ ...n, route: true }))} cta={cta} />
      </div>
    </header>
  );
}
