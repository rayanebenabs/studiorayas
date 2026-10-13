import type { Client } from "@/content/clients";
import { LOGOS } from "@/lib/logos";
import { ClientLogo } from "./ClientLogo";

/** La charte graphique du client, extraite de son Brand OS. */
export function Charte({ client }: { client: Client }) {
  const hasLogo = !!LOGOS[client.slug];
  return (
    <section className="section charte" aria-labelledby="charte-t">
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "var(--sr-space-8)", flexWrap: "wrap" }}>
          <div>
            <p className="sr-eyebrow">Charte graphique</p>
            <h2 id="charte-t" className="title-lg" style={{ marginTop: "var(--sr-space-6)" }}>
              La charte, extraite
              <br />
              du Brand OS livré.
            </h2>
          </div>
          <p className="muted" style={{ maxWidth: "22em" }}>
            Les mêmes règles servent à un humain ou à un agent, sans le studio.
          </p>
        </div>

        <div className="charte__block">
          <p className="sr-eyebrow">Logo</p>
          <div className="charte__tiles">
            {client.logoTiles.map((t) => (
              <div key={t.bg} className="charte__tile" style={{ background: t.bg, color: t.fg }}>
                {hasLogo ? (
                  <ClientLogo slug={client.slug} color={t.fg} />
                ) : (
                  <span style={{ fontFamily: client.logoFont, fontWeight: client.slug === "slayyy" ? 700 : client.slug === "pollen" ? 500 : 300, fontStyle: client.slug === "julie-leroy" ? "italic" : "normal" }}>
                    {client.logoText}
                  </span>
                )}
              </div>
            ))}
          </div>
          {!hasLogo && (
            <p className="muted" style={{ fontSize: "var(--sr-text-xs)", marginTop: "var(--sr-space-2)" }}>
              Aperçu typographique du logo. Le fichier source figure dans le branding ci-dessus.
            </p>
          )}
        </div>

        <div className="charte__block">
          <p className="sr-eyebrow">Palette</p>
          <div className="charte__swatches">
            {client.palette.map((c) => (
              <div key={c.hex}>
                <div className="swatch__chip" style={{ background: c.hex }} />
                <p className="swatch__name">{c.name}</p>
                <p className="swatch__hex">{c.hex}</p>
                <p className="swatch__role">{c.role}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="charte__block">
          <p className="sr-eyebrow">Typographie</p>
          <div className="charte__fonts">
            {client.fonts.map((f) => (
              <div key={f.name} className="font-spec">
                <p className={`font-spec__aa${f.family ? "" : " font-spec__aa--none"}`} style={f.family ? { fontFamily: f.family } : undefined}>
                  Aa
                </p>
                <p className="font-spec__name">{f.name}</p>
                <p>{f.role}</p>
                {f.note && <p className="muted">{f.note}</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="charte__block charte__duo">
          <div>
            <p className="sr-eyebrow">Trois règles qui ne bougent pas</p>
            <ol className="rules">
              {client.rules.map((r, i) => (
                <li key={r}>
                  <span>0{i + 1}</span>
                  {r}
                </li>
              ))}
            </ol>
          </div>
          <div>
            <p className="sr-eyebrow">La voix</p>
            <div className="voice__item">
              <small>Oui</small>
              <p>« {client.voice.yes} »</p>
            </div>
            <div className="voice__item voice__item--no">
              <small>Non</small>
              <p>« {client.voice.no} »</p>
            </div>
            {client.voice.note && (
              <p className="muted" style={{ fontSize: "var(--sr-text-xs)", marginTop: "var(--sr-space-4)" }}>
                {client.voice.note}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
