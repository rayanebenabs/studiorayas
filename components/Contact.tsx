import { CONTACT_EMAIL, CONTACT } from "@/content/site";
import { ButtonLink } from "./brand";

/** Le bloc de contact, le même en bas de chaque page. Le bouton de l'en-tête y mène. */
export function Contact() {
  return (
    <section className="section contact" id="contact" aria-labelledby="contact-t">
      <div className="container">
        <p className="sr-eyebrow">{CONTACT.eyebrow}</p>
        <h2 id="contact-t" className="contact__title">
          Commencer par
          <br />
          un diagnostic.
        </h2>
        <p className="contact__text">{CONTACT.text}</p>
        {CONTACT_EMAIL && (
          <div style={{ marginTop: "var(--sr-space-8)" }}>
            <ButtonLink href={`mailto:${CONTACT_EMAIL}`} variant="secondary" size="lg">
              Écrire au studio
            </ButtonLink>
          </div>
        )}
      </div>
    </section>
  );
}
