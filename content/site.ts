// Textes de la page d'accueil. Voix : brand/BRAND.md, section 4.

/** Adresse de contact du studio. À renseigner : tant qu'elle est vide, le bouton e-mail ne s'affiche pas. */
export const CONTACT_EMAIL = "";

export const BRAND_LINE = "On rend l'artistique technique.";

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
  { title: "Appliquer", text: "Un communiqué devient un post, un post devient un e-mail. Chaque version reste dans la marque, que l'auteur soit humain ou agent." },
  { title: "Vérifier et faire évoluer", text: "Une note et une correction précise, avant publication. Chaque évolution est datée dans le journal, et c'est vous qui la faites." },
];

export interface UsageCard {
  title: string;
  text: string;
  image?: string;
  dark?: boolean;
}

export const USAGES: { tab: string; cards: UsageCard[] }[] = [
  {
    tab: "Vous",
    cards: [
      { title: "Un dossier qui vous appartient", text: "Le Brand OS vous est livré. Il tourne dans vos outils, sans avoir besoin de nous.", dark: true },
      { title: "Vous le faites évoluer seul", text: "Une couleur, un fait, un canal : vous changez la règle, le journal garde la trace.", image: "/travaux/julie/photo1.jpg" },
      { title: "Le jugement reste le vôtre", text: "Le système applique. L'œil tranche.", image: "/travaux/inavoue/guide.jpg" },
      { title: "Une charte vivante", text: "Elle évolue avec vous, version après version, au lieu de dormir dans un PDF.", image: "/travaux/pollen/trainee.jpg" },
    ],
  },
  {
    tab: "Votre équipe",
    cards: [
      { title: "Une seule source", text: "Vous, votre équipe et vos prestataires lisez les mêmes règles. Plus de versions qui se contredisent.", dark: true },
      { title: "La réponse est écrite", text: "« Est-ce que c'est dans la marque ? » ne se discute plus en réunion. La règle tranche.", image: "/travaux/slayyy/p2.jpg" },
      { title: "Changer une fois", text: "Vous modifiez une règle à un seul endroit. Le site, les posts et les agents suivent.", image: "/travaux/julie/print.jpg" },
      { title: "Plus de chasse aux documents", text: "La bonne couleur, le bon prix, la bonne formule : tout est au même endroit.", image: "/travaux/inavoue/colis.jpg" },
    ],
  },
  {
    tab: "Votre agence",
    cards: [
      { title: "Les règles dès le premier jet", text: "Un prestataire arrive avec le Brand OS. Il démarre dans la marque.", dark: true },
      { title: "Un brand-check avant l'envoi", text: "Vos prestataires relisent leur travail avec vos règles avant de vous l'envoyer.", image: "/travaux/slayyy/chrome.jpg" },
      { title: "Moins de recadrage", text: "Le brief tient en un dossier. Les allers-retours portent sur les idées, plus sur la charte.", image: "/travaux/pollen/banner.jpg" },
      { title: "Des faits, pas des suppositions", text: "Un nom, un prix, une date : une seule source, jamais réinventée.", image: "/travaux/julie/c1.jpg" },
    ],
  },
  {
    tab: "Vos agents IA",
    cards: [
      { title: "Vos agents respectent la marque", text: "Le Brand OS se branche dans Claude et ChatGPT. Ils écrivent avec votre voix, vos faits, votre lexique.", dark: true },
      { title: "Plus de faits inventés", text: "Un chiffre absent des faits ne s'écrit pas. L'agent demande au lieu d'inventer.", image: "/travaux/julie/c3.jpg" },
      { title: "Contre l'AI slop", text: "Ce qui rend votre marque unique est écrit. Il ne se dilue pas dans le générique.", image: "/travaux/inavoue/campagne.jpg" },
      { title: "Une règle, partout", text: "Les mêmes règles pour le site, les posts, les e-mails et les agents.", image: "/travaux/slayyy/p1.jpg" },
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

export const OFFER = [
  { name: "Diagnostic", text: "Le regard extérieur, à l'entrée." },
  { name: "Brand OS", text: "L'offre centrale : le dossier de règles livré, que vous faites évoluer seul." },
  { name: "Sparring", text: "Un jour de conseil par mois." },
];

export const WHY_US = [
  "Stratégie et identité sortent de la même main.",
  "La marque est écrite en règles qu'un humain ou un agent applique sans nous.",
  "Chaque recommandation est chiffrée dans un modèle économique.",
  "Le terrain des créateurs : on sait comment une marque tient devant une vraie audience.",
];
