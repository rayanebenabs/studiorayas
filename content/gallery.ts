// Les œuvres accrochées dans la galerie (page /galerie/), dans l'ordre de la visite.
//
// Ajouter une œuvre :
//   1. Déposez l'image dans public/galerie/ (jpg, png ou webp). Le format de l'image donne celui du tableau.
//      C'est la photo de l'œuvre dans son cadre, recadrée au ras du cadre : la scène lui donne son épaisseur,
//      teinte les tranches de la couleur du bord de la photo et pose son ombre sur le mur.
//   2. Remplissez une entrée ci-dessous : `src` vaut "/galerie/nom-du-fichier.jpg".
//   3. `title`, `year`, `technique` : ce qu'affiche le cartel. `note` : l'histoire de l'œuvre, lue quand on s'approche.
//      `alt` décrit l'image pour les lecteurs d'écran.
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
  note?: string; // une ou deux phrases sur le geste et l'inspiration, affichées quand on s'approche
  alt?: string; // ce que montre l'image, lu par les lecteurs d'écran
  instagram?: string;
  size?: number; // taille du tableau en mètres sur son plus grand côté, 1,8 par défaut
}

/** La pancarte posée à l'entrée de la salle : ce que raconte la série. */
export const SERIES = {
  eyebrow: "La série · 2025-2026",
  title: "Vingt semaines pour casser la routine.",
  body: [
    "Chaque semaine, un nouveau style, une nouvelle matière, une nouvelle œuvre. Une série née de la démarche d'expérimentation de @makewithbrandon.",
    "Vingt épisodes publiés sur Instagram, du 21 août 2025 au 13 janvier 2026. Ils sont accrochés dans l'ordre : mur de gauche, mur du fond, puis mur de droite.",
    "Approchez-vous d'une œuvre pour lire son histoire.",
  ],
  instagram: "https://www.instagram.com/p/DNff1uZo2tw/",
};

const ig = (id: string) => `https://www.instagram.com/p/${id}/`;

export const ARTWORKS: Artwork[] = [
  {
    src: "/galerie/oeuvre-3563.jpg", title: "Le terrain", year: "2025", technique: "Peinture texturée",
    note: "D'après le style texturé de Werner Bronkhorst, avec un clin d'œil au Castres Olympique.",
    alt: "Terrain de rugby en peinture épaisse, bandes vertes et blanches", instagram: ig("DNp1FVrIoR6"),
  },
  {
    src: "/galerie/oeuvre-3564.jpg", title: "Le mouvement", year: "2025", technique: "Peinture et collage",
    note: "Inspiré de @sharecestudios. Une technique simple et apaisante, le collage final donne le mouvement.",
    alt: "Abstraction aux couleurs vives, bleus et roses", instagram: ig("DN72q1bDcB4"),
  },
  {
    src: "/galerie/oeuvre-3565.jpg", title: "La Caravelle", year: "2025", technique: "Pastels à l'huile",
    note: "Un coucher de soleil sur la plage de la Caravelle, en Guadeloupe. Premier essai aux pastels à l'huile.",
    alt: "Plage et palmiers sous un ciel orange", instagram: ig("DON9-z6jd_3"),
  },
  {
    src: "/galerie/oeuvre-3566.jpg", title: "Les mouchoirs", year: "2025", technique: "Mouchoirs en papier",
    note: "Une technique repérée chez @as_parul_sees, et un tableau croisé sur Pinterest.",
    alt: "Motif bleu en relief sur papier crème", instagram: ig("DOf7mt2gr7-"),
  },
  {
    src: "/galerie/oeuvre-3567.jpg", title: "Rentrée des classes", year: "2025", technique: "Collage",
    note: "Des souvenirs d'enfance, avec la gazette créative de septembre du Courrier d'Amélie collée dans l'œuvre.",
    alt: "Collage « Pochette » : pingouins, papiers et coupures de texte", instagram: ig("DOymhlajV7W"),
  },
  {
    src: "/galerie/oeuvre-3568.jpg", title: "Souvenir de voyage", year: "2025", technique: "Faïences faites main",
    note: "Au Portugal, les faïences. Impossible d'en ramener, alors elles ont été refaites à la main.",
    alt: "Mosaïque de carreaux de ciment et d'azulejos", instagram: ig("DPEn2FUAmWZ"),
  },
  {
    src: "/galerie/oeuvre-3569.jpg", title: "Portrait de Squeezie", year: "2025", technique: "Portrait en fragments",
    note: "Pour le week-end du GP Explorer, d'après le travail de @tete.au.carre. Le reconnaissez-vous ?",
    alt: "Portrait en noir et blanc recomposé en bandes et en fragments", instagram: ig("DPWqW7XkcFy"),
  },
  {
    src: "/galerie/oeuvre-3570.jpg", title: "Du neuf avec du vieux", year: "2025", technique: "Peinture sur tableau chiné",
    note: "Un tableau de brocante dont personne ne voulait, détourné à la manière de @mow.arts.",
    alt: "Paysage ancien d'arbres, une soucoupe volante et une explosion à l'horizon", instagram: ig("DPocvlUAtsv"),
  },
  {
    src: "/galerie/oeuvre-3571.jpg", title: "Sous la main", year: "2025", technique: "Collage",
    note: "Inspiré de @samy_loewe. Créer avec ce qu'on a sous la main, c'est souvent là que naissent les idées.",
    alt: "Portrait au visage masqué de papiers déchirés rouges et blancs, sur fond jaune", instagram: ig("DP8pwt7Ap1F"),
  },
  {
    src: "/galerie/oeuvre-3572.jpg", title: "Le relief", year: "2025", technique: "Formes en relief",
    note: "Le premier essai en relief, à la moitié de la série.",
    alt: "Formes noires, vertes, jaunes et rouges découpées et superposées", instagram: ig("DQMkxtfjd24"),
  },
  {
    src: "/galerie/oeuvre-3573.jpg", title: "Californication", year: "2025", technique: "Peinture au doigt",
    note: "La pochette de l'album des Red Hot Chili Peppers, refaite au doigt.",
    alt: "Bleu profond au-dessus d'un rouge en matière", instagram: ig("DQhfpR6DSnM"),
  },
  {
    src: "/galerie/oeuvre-3574.jpg", title: "La chute", year: "2025", technique: "Profondeur en couches",
    note: "Un jeu de profondeur parti d'une vidéo de @anastasiakhoroshenko, poussé un peu plus loin.",
    alt: "Formes noires superposées sur fond rouge, une silhouette qui tombe au centre", instagram: ig("DQw5zO0DYFV"),
  },
  {
    src: "/galerie/oeuvre-3575.jpg", title: "Photographier avec le soleil", year: "2025", technique: "Anthotype au curcuma",
    note: "Une image faite par le soleil et un pigment naturel : une feuille enduite de curcuma, exposée des heures en plein soleil, puis fixée au bicarbonate.",
    alt: "Silhouette au trait noir sur fond jaune", instagram: ig("DRC2ToIDfoL"),
  },
  {
    src: "/galerie/oeuvre-3576.jpg", title: "Anthotype et tampon", year: "2025", technique: "Impression au tampon",
    note: "Le mélange des deux techniques des derniers épisodes. Le tableau a été mis en jeu sur Instagram.",
    alt: "Volutes noires sur papier blanc, comme un marbre", instagram: ig("DRPxbsmDRKt"),
  },
  {
    src: "/galerie/oeuvre-3577.jpg", title: "L'illusion", year: "2025", technique: "Illusion d'optique",
    note: "D'après @enzo_prina. En chemin, une obsession d'enfance revient : les labyrinthes au dos des paquets de céréales.",
    alt: "Lignes bleues et rouges qui ondulent", instagram: ig("DRzmi1wggPR"),
  },
  {
    src: "/galerie/oeuvre-3578.jpg", title: "Le tampon", year: "2025", technique: "Tampons Prixel",
    note: "Construire un motif, tester, improviser. Kit de tampons offert par @prixelpress.",
    alt: "Figure symétrique de motifs noirs, roses et bleus sur papier beige", instagram: ig("DR4tNDMAoob"),
  },
  {
    src: "/galerie/oeuvre-3579.jpg", title: "Londres", year: "2025", technique: "Collage de souvenirs",
    note: "Un week-end à Londres pour les illuminations de Noël. Gobelets, plans de musées, tickets de caisse : des riens pleins de souvenirs.",
    alt: "Collage de Londres : monuments, lettres et bus rouge", instagram: ig("DSM9ubjjQNd"),
  },
  {
    src: "/galerie/oeuvre-3580.jpg", title: "Le miroir", year: "2025", technique: "Peinture sur miroir",
    note: "Les gouttes et l'illusion d'après @jochenmuehlenbrink, le miroir matifié à la peinture d'après @yisasvillegas.",
    alt: "Cœur en métal argenté qui coule, sur un miroir mat", instagram: ig("DSc-ulwjdn5"),
  },
  {
    src: "/galerie/oeuvre-3581.jpg", title: "Paper quilling", year: "2026", technique: "Papier roulé",
    note: "Un épisode volontairement simple, au retour des fêtes.",
    alt: "Voilier en papier roulé sur des vagues bleues", instagram: ig("DTBC2ILjbiH"),
  },
  {
    src: "/galerie/oeuvre-3583.jpg", title: "Couture", year: "2026", technique: "Collage cousu à la machine",
    note: "Le dernier épisode, avec la machine à coudre comme outil. D'après @artbywhitneyalyssa, @cutandplaced et @honoredeco. La série devait relancer la créativité. Elle a surtout donné envie d'aller plus loin.",
    alt: "Collage de photographies de maisons et de jardins, traversé de fils cousus", instagram: ig("DTc7j7jAlh8"),
  },
];
