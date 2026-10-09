// Les œuvres accrochées dans la galerie (page /galerie/), dans l'ordre de la visite.
//
// Ajouter une œuvre :
//   1. Déposez l'image dans public/galerie/ (jpg, png ou webp). Le format de l'image donne celui du tableau.
//   2. Remplissez une entrée ci-dessous : `src` vaut "/galerie/nom-du-fichier.jpg".
//   3. `instagram` : le lien de la publication, affiché sous le cartel. Laissez vide s'il n'y en a pas.
//
// Une entrée sans `src` s'affiche comme une toile vierge, « Bientôt accrochée ».
// La salle s'agrandit toute seule s'il y a plus d'œuvres que de murs.

export interface Artwork {
  src: string;
  title: string;
  year: string;
  technique: string; // ex. « Encre sur papier », « Numérique »
  instagram?: string;
  size?: number; // taille du tableau en mètres sur son plus grand côté, 1,8 par défaut
}

export const ARTWORKS: Artwork[] = [
  { src: "", title: "Sans titre", year: "", technique: "" },
  { src: "", title: "Sans titre", year: "", technique: "" },
  { src: "", title: "Sans titre", year: "", technique: "" },
  { src: "", title: "Sans titre", year: "", technique: "" },
  { src: "", title: "Sans titre", year: "", technique: "" },
  { src: "", title: "Sans titre", year: "", technique: "" },
  { src: "", title: "Sans titre", year: "", technique: "" },
  { src: "", title: "Sans titre", year: "", technique: "" },
  { src: "", title: "Sans titre", year: "", technique: "" },
];
