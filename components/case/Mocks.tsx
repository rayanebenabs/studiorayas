import type { CSSProperties, ReactNode } from "react";
import { MOCK_WRONG, getClient, hex, type ClientSlug } from "@/content/clients";
import { ClientLogo } from "./ClientLogo";

export interface MockProps {
  fixed: boolean;
  found: Record<string, number>;
  onFind: (id: string) => void;
}

interface SpotProps extends MockProps {
  id: string;
  label: string;
  children?: ReactNode;
  bg?: boolean;
  style?: CSSProperties;
}

/** Une zone de la maquette : un vrai bouton tant que l'écran est hors marque. */
function Spot({ id, label, children, bg, style, fixed, found, onFind }: SpotProps) {
  if (fixed) {
    return bg ? <div className="mock__bg" style={style} /> : <div style={style}>{children}</div>;
  }
  const n = found[id];
  return (
    <button
      type="button"
      className={`hotspot${bg ? " mock__bg" : ""}`}
      style={style}
      data-found={n ? "true" : "false"}
      aria-pressed={!!n}
      aria-label={n ? `${label} : erreur trouvée` : `Vérifier : ${label}`}
      onClick={() => onFind(id)}
    >
      {children}
      {n ? <span className="hotspot__badge">{n}</span> : null}
    </button>
  );
}

function SlayyyMock(p: MockProps) {
  const c = getClient("slayyy")!;
  const red = p.fixed ? hex(c, "framboise") : MOCK_WRONG.slayyyRed;
  const ink = hex(c, "ink");
  const paper = hex(c, "paper");
  return (
    <div className="mock" style={{ background: paper, color: ink, border: `6px solid ${ink}`, borderRadius: 36, padding: "36px 22px 22px", fontFamily: "'Hanken Grotesk', sans-serif" }}>
      <div className="mock__content">
        <ClientLogo slug="slayyy" color={ink} className="mock-wordmark" />
        <Spot {...p} id="communaute" label="le titre" style={{ marginTop: 14 }}>
          <span style={{ display: "block", fontWeight: 600, fontSize: 20, lineHeight: 1.25 }}>
            {p.fixed ? "Une photo par jour devient ton lookbook." : "Partage tes plus beaux looks avec la communauté !"}
          </span>
        </Spot>
        <div style={{ marginTop: 16, height: 240, borderRadius: 16, overflow: "hidden", position: "relative", background: hex(c, "lavande") }}>
          {c.brandCheck?.src && <img src={c.brandCheck.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: c.brandCheck.focus, filter: "blur(14px)", transform: "scale(1.15)" }} />}
          <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 14 }}>
            Poste pour débloquer
          </span>
        </div>
        <Spot {...p} id="coeur" label="la réaction" style={{ marginTop: 14, width: "auto", display: "inline-block" }}>
          <span style={{ color: red, fontWeight: 600 }}>{p.fixed ? "✦ slayyy" : "♥ 24"}</span>
        </Spot>
        <Spot {...p} id="rouge" label="le bouton" style={{ marginTop: 16 }}>
          <span style={{ display: "block", background: red, color: paper, borderRadius: 999, padding: "15px 0", textAlign: "center", fontWeight: 600 }}>
            Poster mon look
          </span>
        </Spot>
      </div>
    </div>
  );
}

function JulieMock(p: MockProps) {
  const c = getClient("julie-leroy")!;
  const ink = hex(c, "encre");
  const paper = hex(c, "papier");
  return (
    <div className="mock" style={{ background: paper, color: ink, padding: 24, fontFamily: "var(--sr-font-body)", border: `1px solid ${hex(c, "pêche")}` }}>
      <div className="mock__content">
        {c.brandCheck?.src && <img src={c.brandCheck.src} alt="" style={{ width: "100%", height: 150, objectFit: "cover", objectPosition: c.brandCheck.focus }} />}
        <Spot {...p} id="noir" label="le titre" style={{ marginTop: 18 }}>
          <span style={{ display: "block", fontFamily: "'Newsreader', serif", fontSize: 28, lineHeight: 1.1, color: p.fixed ? ink : MOCK_WRONG.julieBlack }}>
            Offrez à votre corps un vrai temps pour lui.
          </span>
        </Spot>
        <Spot {...p} id="soin" label="le texte" style={{ marginTop: 12 }}>
          <span style={{ display: "block", fontSize: 14, lineHeight: 1.5 }}>
            {p.fixed ? "Une séance" : "Un soin"} de drainage lymphatique, chez vous, à Rouen et 30 km alentour.
          </span>
        </Spot>
        <Spot {...p} id="rdv" label="le bouton" style={{ marginTop: 18 }}>
          <span style={{ display: "block", background: hex(c, "terre cuite"), color: paper, borderRadius: 999, padding: "13px 0", textAlign: "center", fontSize: 14, fontWeight: 500 }}>
            {p.fixed ? "Réserver mon Bilan d'Écoute" : "Prendre RDV"}
          </span>
        </Spot>
      </div>
    </div>
  );
}

function InavoueMock(p: MockProps) {
  const c = getClient("inavoue")!;
  const cobalt = hex(c, "cobalt");
  const ecru = hex(c, "écru");
  return (
    <div className="mock" style={{ padding: 24, color: hex(c, "bordeaux"), fontFamily: "var(--sr-font-body)" }}>
      <Spot {...p} id="blanc" label="le fond de la fiche" bg style={{ background: p.fixed ? ecru : MOCK_WRONG.inavoueWhite, border: `1px solid ${ecru}` }} />
      <div className="mock__content">
        {c.brandCheck?.src && <img src={c.brandCheck.src} alt="" style={{ width: "100%", height: 230, objectFit: "cover", objectPosition: c.brandCheck.focus }} />}
        <Spot {...p} id="capitales" label="le nom" style={{ marginTop: 18 }}>
          {p.fixed ? (
            <ClientLogo slug="inavoue" color={cobalt} className="mock-logo" />
          ) : (
            <span style={{ display: "block", fontWeight: 600, fontSize: 26, letterSpacing: "0.04em", color: cobalt }}>L&apos;INAVOUÉ</span>
          )}
        </Spot>
        <Spot {...p} id="exclamation" label="la phrase" style={{ marginTop: 12 }}>
          <span style={{ display: "block", fontSize: 16, lineHeight: 1.45 }}>
            {p.fixed ? "Tu n'as pas à le dire pour que ça compte." : "Le cadeau parfait pour dire je t'aime !"}
          </span>
        </Spot>
        <span style={{ display: "block", marginTop: 18, background: cobalt, color: ecru, padding: "13px 0", textAlign: "center", fontSize: 14, fontWeight: 500 }}>
          Compose le tien
        </span>
      </div>
    </div>
  );
}

function PollenMock(p: MockProps) {
  const c = getClient("pollen")!;
  const light = hex(c, "fond clair");
  return (
    <div className="mock" style={{ aspectRatio: "4 / 5", padding: 28, color: light }}>
      <Spot {...p} id="froid" label="la couleur de fond" bg style={{ background: p.fixed ? hex(c, "orange") : MOCK_WRONG.pollenBlue }} />
      <div className="mock__content" style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <Spot {...p} id="serif" label="le logo" style={{ width: "auto", display: "inline-block", alignSelf: "flex-start" }}>
          {p.fixed ? (
            <ClientLogo slug="pollen" color={light} className="mock-logo" />
          ) : (
            <span style={{ fontFamily: MOCK_WRONG.pollenSerif, fontWeight: 500, fontSize: 34 }}>pollen</span>
          )}
        </Spot>
        <Spot {...p} id="volume" label="le message">
          <span style={{ display: "block", fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 26, lineHeight: 1.15, fontWeight: 500 }}>
            {p.fixed ? "Une influence pensée comme un outil de création." : "On booste ta visibilité avec des milliers d'influenceurs !"}
          </span>
        </Spot>
      </div>
    </div>
  );
}

export function Mock({ slug, ...p }: MockProps & { slug: ClientSlug }) {
  switch (slug) {
    case "slayyy":
      return <SlayyyMock {...p} />;
    case "julie-leroy":
      return <JulieMock {...p} />;
    case "inavoue":
      return <InavoueMock {...p} />;
    case "pollen":
      return <PollenMock {...p} />;
  }
}
