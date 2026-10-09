import { BRAND_LINE } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <span>Studio Rayas · studio de marque</span>
        <em>{BRAND_LINE}</em>
        <small>© 2026</small>
      </div>
    </footer>
  );
}
