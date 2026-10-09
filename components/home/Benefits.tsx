import { BENEFITS } from "@/content/site";
import { Reveal } from "../Reveal";

export function Benefits() {
  return (
    <Reveal as="section" className="section section--papier">
      <div className="container">
        <p className="sr-eyebrow" data-reveal>Ce qui change pour vous</p>
        <h2 className="title-lg" style={{ marginTop: "var(--sr-space-6)" }} data-reveal>
          Une seule source. Chaque équipe. Chaque fois.
        </h2>
        <div className="grid-3" style={{ marginTop: "var(--sr-space-16)", rowGap: "var(--sr-space-12)" }}>
          {BENEFITS.map((b, i) => (
            <div key={b.title} className="point" style={{ borderColor: "var(--sr-color-border)" }} data-reveal>
              <p className="point__n">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="point__title">{b.title}</h3>
              <p className="point__text">{b.text}</p>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
