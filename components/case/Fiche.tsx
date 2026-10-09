import type { Client } from "@/content/clients";

export function Fiche({ client }: { client: Client }) {
  const rows: [string, React.ReactNode][] = [
    ["Client", client.name],
    ["Livrables", client.deliverables],
    ...(client.year ? ([["Année", client.year]] as [string, React.ReactNode][]) : []),
    [
      "En ligne",
      client.href ? (
        <a className="sr-link" href={client.href} target="_blank" rel="noreferrer">
          {client.online}
        </a>
      ) : (
        client.online
      ),
    ],
  ];
  return (
    <div className="container fiche">
      <dl>
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt className="sr-eyebrow">{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
