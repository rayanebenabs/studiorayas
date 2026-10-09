import type { Visual as V } from "@/content/clients";
import { InavoueLogo } from "./InavoueLogo";

/** Une image de cas, ou un logo vectoriel posé sur sa couleur. */
export function Visual({ v, loading = "lazy" }: { v: V; loading?: "lazy" | "eager" }) {
  if (v.logo === "inavoue") {
    return (
      <div style={{ background: v.bg, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <InavoueLogo color={v.fg ?? "currentColor"} className="visual-logo" />
      </div>
    );
  }
  return <img src={v.src} alt={v.alt} loading={loading} />;
}
