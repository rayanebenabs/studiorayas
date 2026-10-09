import { CONTACT_EMAIL, OFFER, WHY_US } from "@/content/site";
import { ButtonLink } from "../brand";

export function Contact() {
  return (
    <section className="section contact" id="contact" aria-labelledby="contact-t">
      <div className="container">
        <p className="sr-eyebrow">Contact</p>
        <h2 id="contact-t" className="contact__title">
          Commencer par
          <br />
          un diagnostic.
        </h2>
        {CONTACT_EMAIL && (
          <div style={{ marginTop: "var(--sr-space-8)" }}>
            <ButtonLink href={`mailto:${CONTACT_EMAIL}`} variant="secondary" size="lg">
              Écrire au studio
            </ButtonLink>
          </div>
        )}

        <div className="contact__studio" id="studio">
          <div>
            <p className="sr-eyebrow">Le studio</p>
            <p className="title-md" style={{ marginTop: "var(--sr-space-4)" }}>
              Studio Rayas est un studio de marque, fondé par Rayane Benabdeljalil. Le studio fonde, il ne fait pas tourner : il livre des objets finis et
              s&apos;arrête quand la marque tient seule.
            </p>
            <ul style={{ marginTop: "var(--sr-space-8)" }}>
              {OFFER.map((o) => (
                <li key={o.name}>
                  <strong>{o.name}</strong>
                  <span>{o.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="sr-eyebrow">Pourquoi nous</p>
            <ul style={{ marginTop: "var(--sr-space-4)" }}>
              {WHY_US.map((w, i) => (
                <li key={w}>
                  <strong>0{i + 1}</strong>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
