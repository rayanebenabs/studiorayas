import Link from "next/link";
import { Totem } from "./Totem";

export function SiteHeader({ home = false }: { home?: boolean }) {
  const base = home ? "" : "/";
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="site-header__brand">
          <Totem />
          <span>Studio Rayas</span>
        </Link>
        <nav aria-label="Navigation principale">
          <ul className="site-header__links">
            <li><a href={`${base}#methode`}>Méthode</a></li>
            <li><a href={`${base}#travaux`}>Travaux</a></li>
            <li><a href={`${base}#studio`}>Studio</a></li>
          </ul>
        </nav>
        <a className="site-header__cta" href={`${base}#contact`}>
          Commencer par un diagnostic
        </a>
      </div>
    </header>
  );
}
