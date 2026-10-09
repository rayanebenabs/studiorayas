// Les œuvres accrochées dans la galerie (page /galerie/), dans l'ordre de la visite.
//
// Ajouter une œuvre :
//   1. Déposez l'image dans public/galerie/ (jpg, png ou webp). Le format de l'image donne celui du tableau.
//   2. Remplissez une entrée ci-dessous : `src` vaut "/galerie/nom-du-fichier.jpg".
//   3. `title`, `year`, `technique` : ce qu'affiche le cartel. `alt` décrit l'image pour les lecteurs d'écran.
//   4. `instagram` : le lien de la publication, affiché sous le cartel. Laissez vide s'il n'y en a pas.
//
// L'ordre de la liste est l'ordre de la visite : mur de gauche, mur du fond, puis mur de droite.
//
// Une entrée sans `src` s'affiche comme une toile vierge, « Bientôt accrochée ».
// La salle s'agrandit toute seule s'il y a plus d'œuvres que de murs.

export interface Artwork {
  src: string;
  title: string;
  year: string;
  technique: string; // ex. « Encre sur papier », « Collage »
  alt?: string; // ce que montre l'image, lu par les lecteurs d'écran
  instagram?: string;
  size?: number; // taille du tableau en mètres sur son plus grand côté, 1,8 par défaut
}

export const ARTWORKS: Artwork[] = [
  { src: "/galerie/oeuvre-3571.jpg", title: "Sans titre", year: "", technique: "", alt: "Portrait au visage masqué de papiers déchirés rouges et blancs, sur fond jaune" },
  { src: "/galerie/oeuvre-3576.jpg", title: "Sans titre", year: "", technique: "", alt: "Motif de veines noires sur papier blanc, comme un marbre" },
  { src: "/galerie/oeuvre-3565.jpg", title: "Sans titre", year: "", technique: "", alt: "Plage et palmiers sous un ciel orange, peinture" },
  { src: "/galerie/oeuvre-3572.jpg", title: "Sans titre", year: "", technique: "", alt: "Formes noires, vertes, jaunes et rouges découpées et superposées" },
  { src: "/galerie/oeuvre-3568.jpg", title: "Sans titre", year: "", technique: "", alt: "Mosaïque de carreaux de ciment et d'azulejos" },
  { src: "/galerie/oeuvre-3580.jpg", title: "Sans titre", year: "", technique: "", alt: "Cœur en métal argenté sur fond noir" },
  { src: "/galerie/oeuvre-3573.jpg", title: "Sans titre", year: "", technique: "", alt: "Bleu profond au-dessus d'un rouge en matière, bande de collage en bas" },
  { src: "/galerie/oeuvre-3578.jpg", title: "Sans titre", year: "", technique: "", alt: "Figure symétrique de motifs noirs, roses et bleus sur papier beige" },
  { src: "/galerie/oeuvre-3579.jpg", title: "Sans titre", year: "", technique: "", alt: "Collage de Londres : monuments, lettres et bus rouge" },
  { src: "/galerie/oeuvre-3574.jpg", title: "Sans titre", year: "", technique: "", alt: "Formes noires transparentes superposées sur fond rouge" },
  { src: "/galerie/oeuvre-3566.jpg", title: "Sans titre", year: "", technique: "", alt: "Motif bleu en relief sur papier crème" },
  { src: "/galerie/oeuvre-3563.jpg", title: "Sans titre", year: "", technique: "", alt: "Bandes vertes et blanches en relief" },
  { src: "/galerie/oeuvre-3581.jpg", title: "Sans titre", year: "", technique: "", alt: "Voilier en papier roulé sur des vagues bleues" },
  { src: "/galerie/oeuvre-3564.jpg", title: "Sans titre", year: "", technique: "", alt: "Abstraction aux couleurs vives, bleus et roses" },
  { src: "/galerie/oeuvre-3569.jpg", title: "Sans titre", year: "", technique: "", alt: "Collage en noir et blanc, fragments d'architecture" },
  { src: "/galerie/oeuvre-3575.jpg", title: "Sans titre", year: "", technique: "", alt: "Silhouette au trait noir sur fond jaune" },
  { src: "/galerie/oeuvre-3577.jpg", title: "Sans titre", year: "", technique: "", alt: "Lignes bleues et rouges qui ondulent" },
  { src: "/galerie/oeuvre-3567.jpg", title: "Sans titre", year: "", technique: "", alt: "Collage « Pochette » : pingouins, papiers et coupures de texte" },
  { src: "/galerie/oeuvre-3570.jpg", title: "Sans titre", year: "", technique: "", alt: "Paysage ancien d'arbres, une explosion à l'horizon" },
  { src: "/galerie/oeuvre-3583.jpg", title: "Sans titre", year: "", technique: "", alt: "Collage de photographies de maisons et de jardins, fils tendus" },
];
