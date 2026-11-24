// Textes de la page d'accueil. Voix : brand/BRAND.md, section 4.

/** Adresse de contact du studio. À renseigner : tant qu'elle est vide, le bouton e-mail ne s'affiche pas. */
export const CONTACT_EMAIL = "";

export const BRAND_LINE = "On rend l'artistique technique.";

export const CONTACT = {
  eyebrow: "Contact",
  text: "Le diagnostic est le regard extérieur, à l'entrée. Ce qui existe, ce qui cloche, ce qu'il faut décider. Et un avis franc sur la suite.",
};

export const PHASES = [
  { n: "01", name: "Brand engineering", line: "Votre marque, écrite comme un système.", totem: "trait" },
  { n: "02", name: "Diagnostic", line: "Un regard extérieur, avant de toucher à quoi que ce soit.", totem: "encre" },
  { n: "03", name: "Brand OS", line: "Vous repartez avec les règles, pas seulement le logo.", totem: "regles" },
  { n: "04", name: "Sparring", line: "Un jour de conseil par mois. On tranche avec vous.", totem: "terre" },
  { n: "05", name: "Jalon", line: "Une validation à chaque étape. Rien n'avance sans votre accord.", totem: "nuit" },
] as const;

export const WHY_NOW = {
  eyebrow: "Pourquoi maintenant",
  title: ["Votre marque est votre actif le plus précieux.", "Vos agents IA ne la connaissent pas."],
  points: [
    { title: "Les agents se multiplient", text: "La plupart des outils de votre équipe intègrent une IA. Chacune a besoin de connaître votre marque." },
    { title: "Sans règles, ils inventent", text: "Une IA sans règles produit du générique : l'AI slop. Le même ton que tout le monde, des faits approximatifs." },
    { title: "Le Brand OS la rend lisible", text: "Votre marque, écrite pour qu'un humain, un outil ou un agent l'applique juste. Sans nous." },
  ],
};

export const MANIFESTO =
  "Votre marque vit dans des PDF, des decks et dans la tête de quelques personnes. Le Brand OS l'écrit en règles, pour qu'un humain ou un agent l'applique sans nous.";

export const STEPS = [
  { title: "Rassembler", text: "Votre marque vit dans des PDF, des decks et la tête de quelques personnes. Le diagnostic rassemble tout ce qui existe." },
  { title: "Écrire", text: "Des règles qu'une IA comprend. Plus de chasse aux documents, plus de faits inventés." },
  { title: "Appliquer", text: "Dans Claude, dans ChatGPT, dans le code de vos sites. Un communiqué devient un post, un post devient un e-mail, et chaque version reste dans la marque." },
  { title: "Vérifier et faire évoluer", text: "Une note et une correction précise, avant publication. Chaque évolution est classée, testée, validée, puis datée dans le journal. C'est vous qui la faites." },
];

export interface UsageCard {
  title: string;
  text: string;
  image?: string;
  dark?: boolean;
}

// Images des cartes : public/accueil/, nommées onglet-numéro de carte (vous-2.jpg = onglet « Vous », 2e carte).
export const USAGES: { tab: string; cards: UsageCard[] }[] = [
  {
    tab: "Vous",
    cards: [
      { title: "Un dossier qui vous appartient", text: "Le Brand OS vous est livré. Il tourne dans vos outils, sans avoir besoin de nous.", image: "/accueil/usages/01-un-dossier-qui-vous-appartient.jpg" },
      { title: "Vous le faites évoluer seul", text: "Une couleur, un fait, un canal : vous changez la règle, le journal garde la trace.", image: "/accueil/usages/02-vous-le-faites-evoluer-seul.jpg" },
      { title: "Le jugement reste le vôtre", text: "Le système applique. L'œil tranche.", image: "/accueil/usages/03-le-jugement-reste-le-votre.jpg" },
      { title: "Une charte vivante", text: "Elle évolue avec vous, version après version, au lieu de dormir dans un PDF.", image: "/accueil/usages/04-une-charte-vivante.jpg" },
    ],
  },
  {
    tab: "Votre équipe",
    cards: [
      { title: "Une seule source", text: "Vous, votre équipe et vos prestataires lisez les mêmes règles. Plus de versions qui se contredisent.", image: "/accueil/usages/05-une-seule-source.jpg" },
      { title: "La réponse est écrite", text: "« Est-ce que c'est dans la marque ? » ne se discute plus en réunion. La règle tranche.", image: "/accueil/usages/06-la-reponse-est-ecrite.jpg" },
      { title: "Changer une fois", text: "Vous modifiez une règle à un seul endroit. Le site, les posts et les agents suivent.", image: "/accueil/usages/07-changer-une-fois.jpg" },
      { title: "Plus de chasse aux documents", text: "La bonne couleur, le bon prix, la bonne formule : tout est au même endroit.", image: "/accueil/usages/08-plus-de-chasse-aux-documents.jpg" },
    ],
  },
  {
    tab: "Votre agence",
    cards: [
      { title: "Les règles dès le premier jet", text: "Un prestataire arrive avec le Brand OS. Il démarre dans la marque.", image: "/accueil/usages/09-les-regles-des-le-premier-jet.jpg" },
      { title: "Un brand-check avant l'envoi", text: "Vos prestataires relisent leur travail avec vos règles avant de vous l'envoyer.", image: "/accueil/usages/10-un-brand-check-avant-l-envoi.jpg" },
      { title: "Moins de recadrage", text: "Le brief tient en un dossier. Les allers-retours portent sur les idées, plus sur la charte.", image: "/accueil/usages/11-moins-de-recadrage.jpg" },
      { title: "Des faits, pas des suppositions", text: "Un nom, un prix, une date : une seule source, jamais réinventée.", image: "/accueil/usages/12-des-faits-pas-des-suppositions.jpg" },
    ],
  },
  {
    tab: "Vos agents IA",
    cards: [
      { title: "Vos agents respectent la marque", text: "Le Brand OS se branche dans Claude et ChatGPT. Ils écrivent avec votre voix, vos faits, votre lexique.", image: "/accueil/usages/13-vos-agents-respectent-la-marque.jpg" },
      { title: "Plus de faits inventés", text: "Un chiffre absent des faits ne s'écrit pas. L'agent demande au lieu d'inventer.", image: "/accueil/usages/14-plus-de-faits-inventes.jpg" },
      { title: "Contre l'AI slop", text: "Ce qui rend votre marque unique est écrit. Il ne se dilue pas dans le générique.", image: "/accueil/usages/15-contre-l-ai-slop.jpg" },
      { title: "Une règle, partout", text: "Les mêmes règles pour le site, les posts, les e-mails et les agents.", image: "/accueil/usages/16-une-regle-partout.jpg" },
    ],
  },
];

export const BENEFITS = [
  { title: "Plus de chasse aux documents", text: "La bonne couleur, le bon prix, la bonne formule : tout est au même endroit." },
  { title: "Plus de faits inventés", text: "Un chiffre absent des faits ne s'écrit pas. L'agent demande au lieu d'inventer." },
  { title: "Moins de réunions de recadrage", text: "Un prestataire arrive avec les règles. Il démarre dans la marque dès le premier jet." },
  { title: "Une relecture avant publication", text: "Le brand-check donne une note et une correction précise. Vos prestataires l'utilisent avant de vous envoyer leur travail." },
  { title: "Une charte vivante", text: "Elle évolue avec vous, version après version, au lieu de dormir dans un PDF." },
  { title: "Ce qui vous distingue, protégé", text: "Ce qui rend votre marque unique est écrit. Il ne se dilue pas dans le générique." },
];

export const OWNED = {
  line: "Une IA ne construit pas une marque. Elle applique celle qu'on lui a écrite.",
  points: [
    { title: "Le jugement reste humain", text: "L'œil du directeur artistique tranche. Le système applique." },
    { title: "Un dossier, pas un logiciel loué", text: "Le Brand OS vous est livré. Il tourne dans vos outils, sans avoir besoin de nous." },
    { title: "Vous le faites évoluer seul", text: "Le studio fonde, il ne fait pas tourner. Il s'arrête quand la marque tient seule." },
  ],
};

export const WHY_US = [
  "Stratégie et identité sortent de la même main.",
  "La marque est écrite en règles qu'un humain ou un agent applique sans nous.",
  "Chaque recommandation est chiffrée dans un modèle économique.",
  "Le terrain des créateurs : on sait comment une marque tient devant une vraie audience.",
];
