import Link from "next/link";
import { BRAND_LINE } from "@/content/site";
import { NAV } from "./SiteHeader";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <span>Studio Rayas · studio de marque</span>
        <em>{BRAND_LINE}</em>
        <nav aria-label="Pages" className="site-footer__nav">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="site-footer__link">
              {n.label}
            </Link>
          ))}
        </nav>
        <small>© 2026</small>
      </div>
    </footer>
  );
}
