// Toutes les images des études de cas, au même endroit.
//
// Changer une image :
//   1. Déposez le fichier dans public/travaux/<cas>/ (jpg, png ou webp).
//   2. Gardez le même nom pour ne rien toucher ici, ou changez `src` ci-dessous.
//   3. Mettez à jour `alt` (ce que montre l'image, lu par les lecteurs d'écran) et `caption` (la légende affichée).
//
// Les images sont recadrées automatiquement pour remplir leur cadre : n'importe quel format passe.
// Si le recadrage coupe le sujet, ajoutez `focus` : le point à garder, ex. "50% 20%" (horizontal, vertical) ou "top".
//
// Formats conseillés :
//   collage      3 visuels d'ouverture, portrait 4:5, 1000 px de large au moins. Le 1er sert aussi d'aperçu dans la liste des travaux.
//   branding     rangées de 2 ou 3 visuels. `span: 2` rend un visuel deux fois plus large que ses voisins.
//                Rangée de 3 : portrait 4:5. Rangée de 2 : carré ou paysage. Ajoutez ou retirez des visuels et des rangées librement.
//   brandCheck   la photo de la maquette du jeu, recadrée en bandeau.
//
// Un visuel `{ logo: "inavoue", ... }` est le logo vectoriel de L'Inavoué posé sur une couleur.
// Pour le remplacer par une photo, écrivez à la place : { src: "/travaux/inavoue/collage-2.jpg", alt: "..." }.

import type { ClientSlug, Visual } from "./clients";

export interface CaseImages {
  collage: [Visual, Visual, Visual];
  branding: { visual: Visual; span: 1 | 2 }[][];
  brandCheck?: Visual; // absent : la maquette n'a pas de photo
}

export const CASE_IMAGES: Record<ClientSlug, CaseImages> = {
  slayyy: {
    collage: [
      { src: "/travaux/slayyy/collage-1.jpg", alt: "Portrait en duotone framboise, wordmark Slayyy" },
      { src: "/travaux/slayyy/collage-2.jpg", alt: "Portrait en duotone framboise, lunettes noires" },
      { src: "/travaux/slayyy/collage-3.jpg", alt: "Portrait en duotone framboise devant un miroir" },
    ],
    branding: [
      [
        { span: 2, visual: { src: "/travaux/slayyy/branding-1.jpg", alt: "Wordmark Slayyy et son étoile", caption: "Wordmark Slayyy et étoile scintillante" } },
        { span: 1, visual: { src: "/travaux/slayyy/branding-2.jpg", alt: "Icône de l'application sur un écran de téléphone", caption: "Icône d'application" } },
      ],
      [
        { span: 1, visual: { src: "/travaux/slayyy/branding-3.jpg", alt: "Affiche Slayyy, silhouettes sur fond rose", caption: "Affiche : « Slayyy » répété, silhouettes" } },
        { span: 1, visual: { src: "/travaux/slayyy/branding-4.jpg", alt: "Affiche Slayyy, une bande de quatre silhouettes", caption: "Affiche : une bande, un jour" } },
        { span: 1, visual: { src: "/travaux/slayyy/branding-5.jpg", alt: "Affiche Slayyy, trois silhouettes", caption: "Affiche : silhouettes sur paper" } },
      ],
      [
        { span: 2, visual: { src: "/travaux/slayyy/branding-6.jpg", alt: "Kit d'icônes chromées roses", caption: "Kit d'icônes chromées" } },
        { span: 1, visual: { src: "/travaux/slayyy/branding-7.jpg", alt: "Monogramme S de Slayyy", caption: "Monogramme" } },
      ],
    ],
    brandCheck: { src: "/travaux/slayyy/brand-check.jpg", alt: "" },
  },

  "julie-leroy": {
    collage: [
      { src: "/travaux/julie-leroy/collage-1.jpg", alt: "Le soleil de Julie Leroy, crème sur fond terracotta" },
      { src: "/travaux/julie-leroy/collage-2.jpg", alt: "Logo Julie Leroy sur une photo de plage au coucher du soleil" },
      { src: "/travaux/julie-leroy/collage-3.jpg", alt: "Publication : jambes lourdes, fatigue, besoin de légèreté ?" },
    ],
    branding: [
      [
        { span: 1, visual: { src: "/travaux/julie-leroy/branding-1.jpg", alt: "Logo Julie Leroy, drainage lymphatique manuel", caption: "Logo et signature « Drainage lymphatique manuel »" } },
        { span: 1, visual: { src: "/travaux/julie-leroy/branding-2.jpg", alt: "Le site julieleroy.fr sur un ordinateur portable", caption: "Site julieleroy.fr" } },
      ],
      [
        { span: 1, visual: { src: "/travaux/julie-leroy/branding-3.jpg", alt: "Croquis du logo : spirale et rayons de soleil", caption: "Croquis du logo" } },
        { span: 1, visual: { src: "/travaux/julie-leroy/branding-4.jpg", alt: "Moodboard organique, floral et serein", caption: "Moodboard" } },
        { span: 1, visual: { src: "/travaux/julie-leroy/branding-5.jpg", alt: "Cartes de visite recto et verso", caption: "Cartes de visite" } },
      ],
    ],
    brandCheck: { src: "/travaux/julie-leroy/brand-check.jpg", alt: "" },
  },

  inavoue: {
    collage: [
      { src: "/travaux/inavoue/collage-1.jpg", alt: "Le bracelet porté, bras levé sur un ciel bleu" },
      { logo: "inavoue", bg: "#F5EEDC", fg: "#041663", alt: "Logo l'inavoué" },
      { src: "/travaux/inavoue/collage-3.jpg", alt: "Le bracelet posé sur un papier orange froissé" },
    ],
    branding: [
      [
        { span: 1, visual: { logo: "inavoue", bg: "#041663", fg: "#F5EEDC", alt: "Logo l'inavoué en écru sur cobalt", caption: "Logo l'inavoué ▬●" } },
        { span: 1, visual: { src: "/travaux/inavoue/branding-2.jpg", alt: "Deux mains, un bracelet en morse au poignet", caption: "Le bracelet au poignet, un mot en morse" } },
      ],
      [
        { span: 1, visual: { src: "/travaux/inavoue/branding-3.jpg", alt: "Enveloppe crème fermée par un cachet de cire au signe ▬●", caption: "Enveloppe et cachet de cire ▬●" } },
        { span: 1, visual: { src: "/travaux/inavoue/branding-4.jpg", alt: "Une main posée sur un oreiller, le bracelet au poignet", caption: "Campagne : le bracelet porté" } },
        { span: 1, visual: { src: "/travaux/inavoue/branding-5.jpg", alt: "Le logo l'inavoué gaufré sur un papier crème", caption: "Logo gaufré sur papier" } },
      ],
    ],
    brandCheck: { src: "/travaux/inavoue/brand-check.jpg", alt: "" },
  },

  pollen: {
    collage: [
      { src: "/travaux/pollen/collage-1.jpg", alt: "Le site thepollen.agency" },
      { src: "/travaux/pollen/collage-2.jpg", alt: "Le double l de Pollen, tracé en noir" },
      { src: "/travaux/pollen/collage-3.jpg", alt: "Le double l de Pollen en dégradé orange sur fond anthracite" },
    ],
    branding: [
      [
        { span: 1, visual: { src: "/travaux/pollen/branding-1.jpg", alt: "Logo Pollen Agency, le double l en boucle", caption: "Logo : le double l en boucle" } },
        { span: 1, visual: { src: "/travaux/pollen/branding-2.jpg", alt: "Le double l en dégradé orange", caption: "Le double l : la traînée d'une abeille en vol" } },
      ],
      [
        { span: 2, visual: { src: "/travaux/pollen/branding-3.jpg", alt: "Logo Pollen blanc sur fond orange", caption: "Logo blanc sur orange" } },
        { span: 1, visual: { src: "/travaux/pollen/branding-4.jpg", alt: "Le site thepollen.agency", caption: "Site thepollen.agency" } },
      ],
    ],
    // La maquette Pollen est un écran sans photo.
  },
};
