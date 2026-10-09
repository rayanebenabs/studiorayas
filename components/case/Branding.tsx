import type { Client } from "@/content/clients";
import { Reveal } from "../Reveal";
import { Visual } from "./Visual";

export function Branding({ client }: { client: Client }) {
  return (
    <Reveal as="section" className="section">
      <div className="container">
        <p className="sr-eyebrow" data-reveal>Le branding</p>
        <h2 className="title-lg" style={{ marginTop: "var(--sr-space-6)", maxWidth: "20em" }} data-reveal>
          {client.brandingTitle}
        </h2>
        <div className="branding__rows">
          {client.branding.map((row, r) => {
            const h = row.length === 3 ? "clamp(300px, 31vw, 470px)" : "clamp(240px, 27vw, 420px)";
            return (
              <div key={r} className="branding__row" style={{ gridTemplateColumns: row.map((c) => `${c.span}fr`).join(" "), ["--h" as string]: h }}>
                {row.map(({ visual }, k) => (
                  <figure key={k} className="branding__fig" data-reveal>
                    <div className="branding__media">
                      <Visual v={visual} />
                    </div>
                    {visual.caption && <figcaption>{visual.caption}</figcaption>}
                  </figure>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </Reveal>
  );
}
