import Link from "next/link";
import { Reveal } from "../Reveal";

/** Un passage vers la galerie : les travaux personnels, à parcourir en 3D. */
export function GalleryTeaser() {
  return (
    <Reveal as="section" className="section section--suite">
      <div className="container">
        <div className="gallery-teaser">
          <div>
            <p className="sr-eyebrow" data-reveal>Galerie</p>
            <h2 id="galerie-t" className="title-lg" style={{ marginTop: "var(--sr-space-6)" }} data-reveal>
              L&apos;œil, en dehors
              <br />
              des commandes.
            </h2>
          </div>
          <div data-reveal>
            <p className="muted">
              Les travaux personnels de Rayane Benabdeljalil, accrochés dans une salle en 3D. Vous la parcourez comme dans un jeu.
            </p>
            <Link href="/galerie/" className="sr-btn sr-btn--primary" style={{ marginTop: "var(--sr-space-6)" }}>
              Entrer dans la galerie
            </Link>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
