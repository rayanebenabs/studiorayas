import { WHY_NOW } from "@/content/site";
import { Reveal } from "../Reveal";

export function WhyNow() {
  return (
    <Reveal as="section" className="section" >
      <div className="container" id="methode">
        <p className="sr-eyebrow" data-reveal>{WHY_NOW.eyebrow}</p>
        <h2 className="title-lg" style={{ marginTop: "var(--sr-space-6)", maxWidth: "20em" }}>
          {WHY_NOW.title.map((t) => (
            <span key={t} data-reveal style={{ display: "block" }}>{t}</span>
          ))}
        </h2>
        <div className="grid-3" style={{ marginTop: "var(--sr-space-16)" }}>
          {WHY_NOW.points.map((pt, i) => (
            <div key={pt.title} className="point" data-reveal>
              <p className="title-md">0{i + 1}</p>
              <h3 className="point__title">{pt.title}</h3>
              <p className="point__text">{pt.text}</p>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
