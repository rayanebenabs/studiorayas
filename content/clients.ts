// Les cas clients. Les couleurs et polices listées ici sont celles des clients :
// elles s'affichent dans leur cas comme des travaux montrés (voir brand/BRAND.md, section 7, règle 8).
// Les images des cas sont rangées à part, dans content/images.ts.

import { CASE_IMAGES } from "./images";

export type ClientSlug = "slayyy" | "julie-leroy" | "inavoue" | "pollen";

export interface Visual {
  src?: string; // image dans public/
  focus?: string; // point gardé au recadrage, ex. "50% 20%"
  logo?: "inavoue"; // logo vectoriel rendu en SVG
  bg?: string;
  fg?: string;
  alt: string;
  caption?: string;
}

export interface Client {
  slug: ClientSlug;
  name: string;
  sector: string;
  signature: string;
  year: string; // vide si non confirmé : la fiche ne l'affiche pas
  deliverables: string;
  online: string;
  href?: string;
  nameScale: number; // taille relative du nom dans le collage
  collage: [Visual, Visual, Visual];
  brandingTitle: string;
  branding: { visual: Visual; span: 1 | 2 }[][];
  brandCheck?: Visual;
  logoTiles: { bg: string; fg: string }[];
  logoFont: string; // famille CSS pour l'aperçu du logo
  logoText: string;
  palette: { name: string; hex: string; role: string }[];
  fonts: { name: string; family: string | null; role: string; note?: string }[];
  rules: string[];
  voice: { yes: string; no: string; note?: string };
  check: { id: string; title: string; rule: string }[];
}

export const CLIENTS: Client[] = [
  {
    slug: "slayyy",
    name: "Slayyy",
    sector: "Application sociale · la tenue du jour entre amis",
    signature: "Everybody slayyy, every dayyy.",
    year: "",
    deliverables: "Identité, Brand OS",
    online: "slayyy.app",
    href: "https://slayyy.app",
    nameScale: 1,
    collage: CASE_IMAGES["slayyy"].collage,
    brandingTitle: "Une marque qui sent le groupe de potes, pas le magazine de mode.",
    branding: CASE_IMAGES["slayyy"].branding,
    brandCheck: CASE_IMAGES["slayyy"].brandCheck,
    logoTiles: [
      { bg: "#B2173B", fg: "#F7F2F3" },
      { bg: "#F7F2F3", fg: "#1B2020" },
    ],
    logoFont: "'Hanken Grotesk', sans-serif",
    logoText: "Slayyy",
    palette: [
      { name: "ink", hex: "#1B2020", role: "Texte, fond sombre" },
      { name: "paper", hex: "#F7F2F3", role: "Fond clair" },
      { name: "framboise", hex: "#B2173B", role: "Action, réaction, étoile" },
      { name: "lavande", hex: "#D3CBE2", role: "Zone secondaire" },
      { name: "ardoise", hex: "#687176", role: "Aplats et filets" },
    ],
    fonts: [
      { name: "PP Mori", family: "'Hanken Grotesk', sans-serif", role: "Toute l'app et les titres", note: "Aperçu en Hanken Grotesk, sa police de secours" },
      { name: "Comico", family: null, role: "Petites notes de communication, jamais dans l'app", note: "Police non affichée ici" },
    ],
    rules: [
      "Trois y : slayyy en minuscules quand la marque écrit, Slayyy pour le nom.",
      "Une seule réaction, le slayyy. Ni cœur, ni note, ni classement.",
      "Tout ce qui se tape est une pilule. Aucune ombre.",
    ],
    voice: { yes: "Une photo par jour devient ton lookbook.", no: "Partage tes plus beaux looks avec la communauté !" },
    check: [
      { id: "rouge", title: "Le rouge #A22A3E", rule: "La règle : framboise #B2173B, seul rouge, un seul grand aplat par écran." },
      { id: "communaute", title: "« la communauté »", rule: "La règle : Slayyy ne dit jamais « communauté ». On dit « ta bande »." },
      { id: "coeur", title: "Le cœur", rule: "La règle : une seule réaction existe, le slayyy. Ni cœur, ni note." },
    ],
  },
  {
    slug: "julie-leroy",
    name: "Julie Leroy",
    sector: "Drainage lymphatique à domicile · Rouen",
    signature: "Offrir à son corps un vrai temps pour lui.",
    year: "",
    deliverables: "Identité, site, Brand OS",
    online: "julieleroy.fr",
    href: "https://julieleroy.fr",
    nameScale: 0.62,
    collage: CASE_IMAGES["julie-leroy"].collage,
    brandingTitle: "Une maison plutôt qu'une cabine.",
    branding: CASE_IMAGES["julie-leroy"].branding,
    brandCheck: CASE_IMAGES["julie-leroy"].brandCheck,
    logoTiles: [
      { bg: "#FBF6DF", fg: "#D37431" },
      { bg: "#D37431", fg: "#FBF6DF" },
    ],
    logoFont: "'Newsreader', serif",
    logoText: "Julie Leroy",
    palette: [
      { name: "papier", hex: "#FBF6DF", role: "Fond de toutes les pages" },
      { name: "encre", hex: "#2B2118", role: "Texte, sépia chaud" },
      { name: "terracotta", hex: "#D37431", role: "Soleil, wordmark, aplats" },
      { name: "terre cuite", hex: "#A5561F", role: "Boutons, liens, focus" },
      { name: "olive", hex: "#9AAD5E", role: "Second rôle" },
      { name: "pêche", hex: "#F4C6A8", role: "Touche douce" },
    ],
    fonts: [
      { name: "Newsreader", family: "'Newsreader', serif", role: "Titres et texte de labeur" },
      { name: "Archivo", family: "'Archivo', sans-serif", role: "Interface : nav, boutons, labels" },
      { name: "Gione Secari", family: null, role: "Le nom « Julie Leroy » uniquement", note: "Police non affichée ici" },
      { name: "Caveat", family: "'Caveat', cursive", role: "La signature de « Qui je suis », nulle part ailleurs" },
    ],
    rules: [
      "Des neutres chauds sur 90 % de l'écran : papier, encre sépia, filet.",
      "Deux terracottas : un pour la marque, un pour tout ce qui se clique.",
      "Pas de mode sombre : le papier est un invariant.",
    ],
    voice: { yes: "Réserver mon Bilan d'Écoute", no: "Prendre RDV" },
    check: [
      { id: "rdv", title: "« Prendre RDV »", rule: "La règle : le bouton principal dit « Réserver mon Bilan d'Écoute »." },
      { id: "soin", title: "« soin »", rule: "La règle : on dit « séance », jamais « soin »." },
      { id: "noir", title: "Le noir pur", rule: "La règle : le texte est en encre sépia #2B2118, jamais en noir ni en gris froid." },
    ],
  },
  {
    slug: "inavoue",
    name: "L'Inavoué",
    sector: "Bracelets en morse · un mot sur un cordon",
    signature: "Des bijoux qui se disent autrement.",
    year: "2026",
    deliverables: "Diagnostic, identité, Brand OS",
    online: "Lancement en novembre 2026",
    nameScale: 0.78,
    collage: CASE_IMAGES["inavoue"].collage,
    brandingTitle: "Une maison de mode, pour un mot en morse.",
    branding: CASE_IMAGES["inavoue"].branding,
    brandCheck: CASE_IMAGES["inavoue"].brandCheck,
    logoTiles: [
      { bg: "#041663", fg: "#F5EEDC" },
      { bg: "#F5EEDC", fg: "#041663" },
    ],
    logoFont: "'Archivo', sans-serif",
    logoText: "l'inavoué",
    palette: [
      { name: "cobalt", hex: "#041663", role: "Signature, fonds forts, logo" },
      { name: "écru", hex: "#F5EEDC", role: "Fond principal, remplace le blanc" },
      { name: "orange", hex: "#CC5500", role: "Accent, campagne, un cordon" },
      { name: "bordeaux", hex: "#3C0E0D", role: "Accent sombre, texte sur écru" },
      { name: "olive", hex: "#7C8550", role: "Touches précises, matière" },
    ],
    fonts: [
      { name: "Satoshi", family: null, role: "Titres, Bold 700", note: "Police non affichée ici" },
      { name: "Synonym", family: null, role: "Texte, Regular 400", note: "Police non affichée ici" },
    ],
    rules: [
      "Jamais de fond blanc : l'écru le remplace.",
      "Au logo, « l'inavoué » en minuscules avec le signe ▬●.",
      "Pas de point d'exclamation, pas de majuscules criardes.",
    ],
    voice: { yes: "Tu n'as pas à le dire pour que ça compte.", no: "Le cadeau parfait pour dire je t'aime !" },
    check: [
      { id: "blanc", title: "Le fond blanc", rule: "La règle : jamais de fond blanc, l'écru #F5EEDC le remplace." },
      { id: "exclamation", title: "Le point d'exclamation", rule: "La règle : pas de point d'exclamation. La marque est pudique." },
      { id: "capitales", title: "« L'INAVOUÉ » en capitales", rule: "La règle : dans les textes, « L'Inavoué ». Jamais de majuscules criardes." },
    ],
  },
  {
    slug: "pollen",
    name: "Pollen Agency",
    sector: "Agence d'influence créative",
    signature: "Influence, création et marques à impact.",
    year: "2025",
    deliverables: "Identité, charte graphique, Brand OS",
    online: "thepollen.agency",
    href: "https://thepollen.agency",
    nameScale: 0.5,
    collage: CASE_IMAGES["pollen"].collage,
    brandingTitle: "La traînée d'une abeille en vol.",
    branding: CASE_IMAGES["pollen"].branding,
    brandCheck: CASE_IMAGES["pollen"].brandCheck,
    logoTiles: [
      { bg: "#FDF7F1", fg: "#2E2E2E" },
      { bg: "#FC672A", fg: "#FDF7F1" },
    ],
    logoFont: "'Bricolage Grotesque', sans-serif",
    logoText: "pollen",
    palette: [
      { name: "orange", hex: "#FC672A", role: "Accent vif" },
      { name: "orange solaire", hex: "#FF7C11", role: "Accent vif" },
      { name: "jaune pollen", hex: "#FFAB41", role: "Accent vif" },
      { name: "fond clair", hex: "#FDF7F1", role: "Fond, en équilibre avec les accents" },
      { name: "rouge", hex: "#EE2A26", role: "Accent, contraste" },
      { name: "anthracite", hex: "#2E2E2E", role: "Texte" },
    ],
    fonts: [
      { name: "Bricolage Grotesque", family: "'Bricolage Grotesque', sans-serif", role: "Tous les supports, du site aux présentations" },
      { name: "Handsome", family: null, role: "Manuscrite, avec parcimonie", note: "Police non affichée ici" },
    ],
    rules: [
      "Un fond clair en équilibre avec des accents vifs, posés avec intention.",
      "La traînée d'abeille : un fil continu qui rythme, jamais qui surcharge.",
      "Le double l en boucle porte le logo. Il ne se recompose pas.",
    ],
    voice: {
      yes: "L'objectif n'est pas la taille de la communauté, mais l'alignement et l'impact.",
      no: "On booste ta visibilité avec des milliers d'influenceurs !",
      note: "Voix relevée sur thepollen.agency : un « nous » qui vouvoie, et l'idée plutôt que le volume.",
    },
    check: [
      { id: "froid", title: "Le bleu froid", rule: "La règle : une palette solaire, orange, jaune et rouge sur fond clair." },
      { id: "serif", title: "La police à empattements", rule: "La règle : Bricolage Grotesque sur tous les supports." },
      { id: "volume", title: "« des milliers d'influenceurs »", rule: "La règle : Pollen parle d'idées et d'alignement, jamais de volume. Et vouvoie." },
    ],
  },
];

export const getClient = (slug: string) => CLIENTS.find((c) => c.slug === slug);

/** Les écarts glissés dans les maquettes du brand-check : des valeurs volontairement hors marque. */
export const MOCK_WRONG = {
  slayyyRed: "#A22A3E",
  julieBlack: "#000000",
  inavoueWhite: "#FFFFFF",
  pollenBlue: "#2B59C3",
  pollenSerif: "Georgia, 'Times New Roman', serif",
};

export const hex = (client: Client, name: string) => client.palette.find((p) => p.name === name)?.hex ?? "currentColor";
