"use client";

import { useState } from "react";
import type { Client } from "@/content/clients";
import { Button } from "../brand";
import { Mock } from "./Mocks";

/** Le jeu du brand-check : trouver les trois écarts glissés dans un écran du client. */
export function BrandCheckGame({ client }: { client: Client }) {
  const [found, setFound] = useState<Record<string, number>>({});
  const [misses, setMisses] = useState(0);
  const ids = client.check.map((c) => c.id);
  const count = Object.keys(found).length;
  const solved = count === ids.length;

  const onFind = (id: string) => {
    setFound((f) => (f[id] ? f : { ...f, [id]: Object.keys(f).length + 1 }));
  };

  const revealAll = () => setFound(Object.fromEntries(ids.map((id, i) => [id, found[id] ?? i + 1])));
  const reset = () => {
    setFound({});
    setMisses(0);
  };

  return (
    <section className="section section--papier" aria-labelledby="check-t">
      <div className="container">
        <p className="sr-eyebrow">Brand-check</p>
        <h2 id="check-t" className="title-lg" style={{ marginTop: "var(--sr-space-6)" }}>
          Trois erreurs se cachent dans cet écran.
          <br />
          Trouvez-les.
        </h2>
        <p className="lead muted" style={{ marginTop: "var(--sr-space-4)" }}>
          Cliquez là où l&apos;écran sort de la marque {client.name}. Chaque erreur trouvée affiche la règle du Brand OS qui l&apos;interdit.
        </p>

        <div className="game">
          <div
            onClick={(e) => {
              if (!solved && !(e.target as HTMLElement).closest(".hotspot")) setMisses((m) => m + 1);
            }}
          >
            <Mock slug={client.slug} fixed={false} found={found} onFind={onFind} />
          </div>

          <div aria-live="polite">
            <div className="game__score">
              <strong>
                {count} / {ids.length}
              </strong>
              <span className="muted">{count > 1 ? "erreurs trouvées" : "erreur trouvée"}</span>
            </div>
            <div className="game__bars" aria-hidden="true">
              {ids.map((id, i) => (
                <span key={id} data-on={i < count} />
              ))}
            </div>
            <ol className="game__list">
              {client.check.map((c, i) => {
                const n = found[c.id];
                return (
                  <li key={c.id} data-found={n ? "true" : "false"}>
                    <span>0{i + 1}</span>
                    <div>
                      <h3>{n ? c.title : "?"}</h3>
                      <p>{n ? c.rule : "Pas encore trouvée."}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
            <div className="game__actions">
              {!solved && (
                <Button variant="secondary" size="sm" onClick={revealAll}>
                  Voir les réponses
                </Button>
              )}
              {count > 0 && (
                <Button variant="ghost" size="sm" onClick={reset}>
                  Recommencer
                </Button>
              )}
            </div>
            {misses > 0 && !solved && (
              <p className="muted" style={{ fontSize: "var(--sr-text-sm)", marginTop: "var(--sr-space-3)" }}>
                Cette zone est dans la marque. Cherchez encore.
              </p>
            )}
          </div>

          <div className="game__col--fixed" data-show={solved}>
            <p className="sr-eyebrow">{solved ? "3 / 3 · La vraie version" : "La vraie version, après le check"}</p>
            <div style={{ marginTop: "var(--sr-space-3)" }}>
              <Mock slug={client.slug} fixed found={{}} onFind={() => undefined} />
            </div>
            {solved && <p className="game__reveal">Ce qu&apos;un Brand OS empêche, avant même la relecture.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
