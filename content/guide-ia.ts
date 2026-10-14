// Guide « L'IA au service des artistes », promis dans une vidéo. Page non répertoriée : /guide-ia-artistes/.
// Texte de Rayane, adressé aux artistes : il tutoie, contrairement au reste du site.

export const INSTAGRAM_URL = "https://www.instagram.com/studiorayas/";
export const TIKTOK_URL = "https://www.tiktok.com/@studiorayas";

export interface GuidePoint {
  title: string;
  text: string;
}

export interface GuidePart {
  id: string;
  title: string;
  intro: string;
  points: GuidePoint[];
  note?: string;
}

export const GUIDE = {
  title: "L'IA au service des artistes",
  date: "14 oct. 2026",
  author: "Rayane",
  intro: [
    "L'IA peut faire gagner du temps à un artiste et donner plus de valeur à son travail, à une condition : rester un assistant. La main, le regard et les choix restent les tiens.",
    "Ce guide s'adresse aux illustrateurs, graphistes, peintres, couturières, artisans d'art et à toute personne qui crée de ses mains. Il ne contient pas de prompts. Il liste des façons concrètes de se faire accompagner par l'IA, du travail à l'atelier jusqu'à l'admin.",
  ],
  rules: [
    { title: "L'IA ne remplace pas ta création.", text: "Elle t'aide à la montrer, à la comprendre, à la nourrir et à l'entourer." },
    { title: "Ta voix d'abord.", text: "Tout ce qui sort de l'IA (texte, retouche, plan) doit sonner et ressembler à toi. Sinon, on corrige." },
    { title: "Tu restes juge.", text: "L'IA se trompe, invente parfois, et ne connaît pas ton public mieux que toi." },
  ],
  howTo: "Les dix parties sont indépendantes. Pioche celle qui répond à ton besoin du moment, il n'y a pas d'ordre imposé.",
};

export const PARTS: GuidePart[] = [
  {
    id: "valoriser",
    title: "Valoriser son œuvre",
    intro: "Beaucoup d'artistes savent créer mais peinent à parler de leur travail. L'IA sert ici de traductrice entre ce que tu fais et ce que les autres ont besoin de lire.",
    points: [
      { title: "Raconter une pièce.", text: "Plutôt que d'écrire seul face à la page, tu te fais interviewer par l'IA : d'où vient l'idée, quelle technique, ce qui t'a résisté. À partir de tes réponses, elle rédige la note d'intention, la légende et la fiche portfolio. Tu parles, elle met en forme." },
      { title: "Adapter sa bio à chaque contexte.", text: "Une galerie, un appel à projets, un profil Instagram et un client corporate n'attendent pas le même texte. L'IA décline une base unique en plusieurs versions, avec le bon ton et la bonne longueur." },
      { title: "Montrer l'œuvre en situation.", text: "Une illustration posée sur un mur, un textile, un packaging ou une affiche aide un client à se projeter. C'est utile pour vendre une licence ou proposer une collab." },
      { title: "Repérer les opportunités.", text: "Résidences, prix, appels à projets, concours : l'IA aide à les trouver, à vérifier si ton travail colle aux critères, puis à structurer le dossier." },
    ],
  },
  {
    id: "photoshoot",
    title: "Rendre un photoshoot pro",
    intro: "Une belle œuvre mal photographiée se vend mal. Sans studio ni photographe, l'IA permet d'atteindre un rendu professionnel.",
    points: [
      { title: "Préparer la prise de vue.", text: "Décris ton espace, ta lumière et ton matériel (même un simple smartphone) : l'IA te propose un placement, un angle et un fond adaptés au format de l'œuvre." },
      { title: "Rester fidèle aux couleurs.", text: "La photo trahit souvent l'original. L'IA aide à corriger la balance des blancs et la colorimétrie pour que le rendu écran ressemble à la pièce réelle." },
      { title: "Mettre en scène sans louer de studio.", text: "Elle permet de placer une photo propre dans un décor crédible (atelier, intérieur, lifestyle) pour donner du contexte et de l'envie." },
      { title: "Décliner les visuels.", text: "Un même cliché devient fiche produit, bannière de site, post carré et story verticale, grâce au détourage, au recadrage et à l'adaptation des formats." },
    ],
  },
  {
    id: "imperfections",
    title: "Retravailler les imperfections non récupérables",
    intro: "Il y a des images qu'on ne peut plus refaire : l'œuvre est vendue, le carnet est abîmé, le moment est passé. L'IA permet de sauver ces visuels sans toucher à l'œuvre elle-même.",
    points: [
      { title: "Nettoyer un scan ou une photo.", text: "Elle retire les reflets sur un vernis, les poussières, les plis du papier ou une trace de doigt sur la vitre." },
      { title: "Récupérer une image ratée.", text: "Elle peut rendre exploitable la seule photo floue, sous-exposée ou mal cadrée d'une pièce déjà partie chez son acheteur." },
      { title: "Étendre un cadrage.", text: "Une photo trop serrée peut être prolongée sur les bords pour passer en format paysage, en bannière ou en couverture." },
      { title: "Restaurer des archives.", text: "Vieux carnets, tirages jaunis, diapos : elle remet en état ton fonds pour le republier ou l'exposer." },
    ],
    note: "Une précision honnête : on corrige l'image de l'œuvre, jamais l'œuvre. Si la retouche change ce que tu as réellement fait, il faut le dire à qui achète ou expose.",
  },
  {
    id: "contenu",
    title: "Créer du contenu",
    intro: "Les réseaux mangent un temps fou qui manque ensuite à l'atelier. Le but n'est pas de publier plus, mais de publier sans y laisser sa semaine.",
    points: [
      { title: "Un calendrier réaliste.", text: "L'IA part de ce que tu produis déjà (une pièce en cours, une expo, une commande) et en tire un rythme de publication tenable, au lieu d'un planning idéal que tu abandonnes au bout de deux semaines." },
      { title: "Des légendes dans ta voix.", text: "Tu enregistres une note vocale en finissant ta session, l'IA la transforme en légende ou en newsletter qui sonne comme toi. Plus tu lui donnes d'anciens textes, plus elle colle à ton ton." },
      { title: "Un making-of, plusieurs formats.", text: "Une seule session filmée devient un reel, un carrousel étape par étape et un paragraphe de newsletter." },
      { title: "Recycler son fonds.", text: "Tes anciennes pièces sont une mine. L'IA aide à les retrouver, à les regrouper par thème et à les republier avec un nouvel angle." },
    ],
  },
  {
    id: "inspiration",
    title: "Trouver l'inspiration",
    intro: "L'inspiration ne tombe pas du ciel, elle s'entretient. Ici, l'IA ne fait pas d'images à ta place : elle te pose des questions, te lance des défis et t'aide à comprendre ce qui te nourrit.",
    points: [
      { title: "Un programme de contraintes sur mesure.", text: "Une technique imposée, un sujet tiré au sort, une palette limitée, un temps chronométré... L'IA construit une progression sur plusieurs semaines en fonction de ton niveau et de tes blocages." },
      { title: "Un partenaire de réflexion.", text: "Tu lui soumets un thème, elle te renvoie des associations d'idées, des références culturelles et des angles auxquels tu n'aurais pas pensé. À toi de garder ce qui résonne." },
      { title: "Une moodboard qui s'explique.", text: "Tu rassembles des images qui te parlent, puis l'IA t'aide à comprendre ce qu'elles ont en commun (une lumière, une tension, une époque) pour en faire une direction." },
      { title: "Un journal créatif dialogué.", text: "Quelques minutes par jour pour noter ce que tu as fait et ressenti. Avec le temps, l'IA fait remonter tes thèmes récurrents et ce qui te bloque." },
      { title: "Sortir de la page blanche.", text: "Plutôt que de recevoir une solution toute faite, tu te fais poser les bonnes questions jusqu'à ce que l'idée vienne de toi." },
    ],
  },
  {
    id: "demarche",
    title: "Comprendre la démarche des artistes",
    intro: "Connaître l'histoire de son art aide à savoir d'où l'on vient et où l'on veut aller. L'IA devient un professeur d'histoire de l'art disponible à toute heure et à qui l'on peut tout demander.",
    points: [
      { title: "Décrypter une œuvre ou un mouvement.", text: "Le contexte de l'époque, les intentions de l'artiste, les techniques utilisées, ce qui a fait scandale ou rupture." },
      { title: "Situer son propre travail.", text: "En décrivant ta pratique, tu découvres les courants et les artistes dont tu es proche sans le savoir. C'est utile pour se nourrir, et pour en parler en galerie." },
      { title: "Suivre l'évolution d'un style.", text: "Comment un artiste est passé de ses débuts à sa signature : ses périodes, ses ruptures, ses choix. C'est rassurant quand on doute de son propre chemin." },
      { title: "Préparer une visite.", text: "Avant une expo ou une visite d'atelier, l'IA te donne les clés pour regarder autrement et poser les bonnes questions." },
    ],
    note: "Astuce : vérifie les dates et les citations précises dans une source fiable, car l'IA peut se tromper sur les détails.",
  },
  {
    id: "mieux-creer",
    title: "Mieux créer",
    intro: "L'IA peut jouer le rôle d'un regard extérieur et exigeant, celui qu'on a rarement quand on travaille seul.",
    points: [
      { title: "Mettre des mots sur son style.", text: "En analysant une série de tes pièces, l'IA t'aide à identifier tes signatures : traits, couleurs, sujets, cadrages. C'est la base pour rester cohérent et pour expliquer ce qui te rend reconnaissable." },
      { title: "Recevoir un retour technique.", text: "Tu soumets une pièce et tu demandes un avis sur la composition, la hiérarchie visuelle, la lisibilité, les contrastes ou l'accessibilité des couleurs. Un retour factuel, sans flatterie, à prendre ou à laisser." },
      { title: "Explorer vite en amont.", text: "Avant de te lancer, tu peux tester plusieurs pistes de composition ou de mise en page pour choisir la bonne. Ces roughs restent des esquisses de travail : l'œuvre finale reste de ta main." },
    ],
  },
  {
    id: "logiciels",
    title: "Apprendre ses logiciels",
    intro: "Les tutos génériques font perdre des heures pour une seule astuce. Avec l'IA, l'apprentissage part de ton projet réel.",
    points: [
      { title: "Un tuteur qui voit ton écran.", text: "Tu partages une capture de Procreate, Illustrator, Photoshop ou Affinity, tu expliques ce que tu veux obtenir, et l'IA te guide pas à pas avec les bons menus et outils." },
      { title: "Apprendre sur ton propre projet.", text: "Plutôt que de suivre un exercice qui ne te concerne pas, tu apprends la vectorisation, les calques ou la typo directement sur ce que tu es en train de faire." },
      { title: "Automatiser les tâches répétitives.", text: "Exports par lots, renommage de fichiers, déclinaisons de formats : l'IA aide à créer des actions ou des scripts sur mesure, même si tu ne sais pas coder." },
    ],
  },
  {
    id: "admin",
    title: "Gérer factures et admin",
    intro: "L'admin est souvent la partie la plus redoutée du métier d'artiste. L'IA ne remplace ni un comptable ni un juriste, mais elle rend tout ça beaucoup moins lourd.",
    points: [
      { title: "Devis, factures et relances.", text: "Elle t'aide à rédiger un devis clair, à préparer une facture complète et à écrire une relance d'impayé ferme mais courtoise." },
      { title: "Comprendre son statut.", text: "Artiste-auteur, micro-entreprise, URSSAF, déclarations, TVA : l'IA explique les règles en langage simple et t'aide à te faire un calendrier des échéances." },
      { title: "Suivre ses revenus et fixer ses prix.", text: "Un tableau simple des ventes et commandes, et un raisonnement pour justifier tes tarifs (temps passé, usage, diffusion, exclusivité)." },
      { title: "Cadrer ses contrats.", text: "Cession de droits, licence, durée, territoire, et désormais clauses sur l'usage de ton travail par l'IA. Elle t'aide à comprendre ce que tu signes et à préparer tes questions." },
    ],
    note: "Pour toute décision fiscale ou juridique engageante, fais valider par un professionnel. Les règles changent et dépendent de ta situation.",
  },
  {
    id: "brand-os",
    title: "Graphistes : du livrable au Brand OS",
    intro: "Aujourd'hui, une identité visuelle se livre souvent sous forme de charte PDF que personne ne relit. Avec l'IA, le graphiste peut livrer un système vivant, et changer la façon dont son travail est perçu et rémunéré.",
    points: [
      { title: "Livrer un système qui s'interroge.", text: "Un Brand OS rassemble logo, couleurs, typos, ton, règles et exemples dans un format que l'IA du client peut lire. Quand l'équipe crée un post ou une présentation, l'IA applique la marque au lieu de l'inventer." },
      { title: "Faire de l'identité un garde-fou.", text: "Le système peut vérifier un visuel ou un texte avant publication et signaler ce qui sort du cadre. Ton travail continue de protéger la marque après ton départ." },
      { title: "Rendre le raisonnement visible.", text: "Pourquoi cette typo, ce vert, cet espacement : documenter chaque choix montre la réflexion derrière le dessin. C'est cette valeur intellectuelle que le client paie, et qu'une IA seule ne produit pas." },
      { title: "Passer du ponctuel à la relation durable.", text: "Une marque évolue : nouveaux supports, nouvelles campagnes, nouveaux besoins. Le graphiste devient l'architecte et le gardien du système, avec un suivi régulier plutôt qu'une facture unique." },
    ],
  },
];

export const SAFEGUARDS = {
  title: "Garde-fous et par où commencer",
  intro: "Quelques réflexes permettent de profiter de l'IA sans y perdre sa singularité ni ses droits.",
  points: [
    { title: "Protège ton travail.", text: "Lis les conditions des outils que tu utilises, désactive l'utilisation de tes fichiers pour l'entraînement quand c'est possible, et ne partage pas d'inédits sensibles." },
    { title: "Sois transparent.", text: "Si une image publiée a été retouchée ou mise en scène par l'IA, dis-le quand ça compte pour l'acheteur ou le diffuseur." },
    { title: "Garde ta voix.", text: "Relis toujours ce que l'IA écrit pour toi. Si tu ne te reconnais pas, réécris." },
    { title: "Vérifie les faits.", text: "Dates, règles fiscales, citations : l'IA peut se tromper avec beaucoup d'assurance." },
  ] as GuidePoint[],
  startLead: "Pour démarrer, choisis un seul irritant et teste pendant deux semaines :",
  steps: [
    "Repère la tâche qui te coûte le plus (la bio, les légendes, les photos, les factures).",
    "Ouvre la partie du guide qui y correspond et teste une seule piste.",
    "Garde ce qui te fait gagner du temps ou de la valeur, laisse le reste.",
    "Passe à l'irritant suivant.",
  ],
};

export const OUTRO = {
  title: "Pour continuer",
  line: "Utiliser l'IA n'enlève rien à ta créativité. Bien utilisée, elle te laisse plus de temps pour créer, et plus d'envie aussi.",
  about: "Je suis Rayane, ingénieur informatique devenu graphiste. Je vis entre la technique et la création, et c'est de ce double regard qu'est né ce guide.",
  social: "Sur @studiorayas (Instagram et TikTok), je partage chaque semaine des idées pour stimuler ta créativité, des coulisses de projets et des façons concrètes de faire de l'IA une alliée plutôt qu'une menace.",
  share: "Si ce guide t'a été utile, transmets-le à un ami artiste qui en a besoin, et viens me raconter ce que tu as testé.",
};

// Exemple pas à pas, placé après la partie 2 : de la photo d'atelier à la galerie en ligne.
export const EXAMPLE = {
  id: "exemple",
  eyebrow: "Exemple concret",
  title: "De la photo d'atelier à la galerie en ligne",
  intro: "Voici le process complet que j'ai suivi pour exposer ma série « 20 semaines pour stimuler ma créativité » sur mon site.",
  shoot: {
    title: "Photographier chaque cadre",
    text: "J'ai pris l'ensemble des œuvres de la série et j'ai photographié chaque cadre au mur, avec mon appareil. Un téléphone suffit.",
  },
  ai: {
    title: "Le photoshoot, par l'IA",
    text: "J'ai envoyé chaque photo à ChatGPT avec le prompt ci-dessous. Résultat : une photo digne d'un catalogue, sur fond blanc, sans toucher à l'œuvre.",
    before: { src: "/guide/photoshoot-avant.jpg", label: "Avant · la photo prise au mur", alt: "Photo du tableau encadré au mur, prise de face avec un appareil, un autre cadre visible au-dessus" },
    after: { src: "/guide/photoshoot-apres.webp", label: "Après · la photo de studio", alt: "Le même tableau encadré, isolé sur un fond blanc de galerie, avec une ombre légère" },
    prompt: `Rôle : Tu es un photographe d'art et d'exposition professionnel.

Tâche : À partir de l'image de la peinture encadrée fournie en pièce jointe, génère une photographie de studio haute résolution de cette même œuvre, en conservant le tableau et son cadre d'origine exactement tels qu'ils apparaissent, mais isolés sur un fond blanc neutre.

Directives de génération :

• Fidélité absolue (Œuvre & Cadre) : Conserve très précisément le tableau ET le cadre existant de la photo d'origine (couleurs, formes, texture, patine, et épaisseur du cadre d'origine, ainsi que l'œuvre elle-même). Ne modifie, n'ajoute et ne retire aucun de ces éléments.

• Support invisible : Le tableau et son cadre sont fixés à plat contre le mur. Aucun câble, rail, crochet, clou, ou fil d'attache ne doit être visible.

• Environnement (Minimaliste) : Place cette œuvre (peinture + son cadre d'origine) seule au centre de l'image, sur un mur blanc de galerie d'art propre et uni, de face. Il n'y a aucun sol, meuble, plinthe, ou autre élément visible autour.

• Prise de vue : Une photo prise strictement de face (vue frontale, parfaitement droite et alignée), sans perspective inclinée, de manière à avoir une reproduction digne d'un catalogue ou d'une galerie d'art.

• Éclairage : Éclairage de studio naturel, doux et homogène, sans reflets sur le verre ou la toile, projetant une infime et subtile ombre naturelle à l'arrière du cadre sur le mur blanc pour lui donner du relief et de la présence.`,
  },
  code: {
    title: "La galerie, avec Claude Code",
    text: "J'ai ensuite demandé à Claude Code de construire une galerie d'art interactive pour exposer les œuvres en ligne. Voici le prompt.",
    prompt: `Crée une page /galerie/ sur mon site : une galerie d'art en 3D qu'on parcourt comme dans un jeu vidéo, pour exposer ma série « 20 semaines pour stimuler ma créativité ».

• La salle : une pièce d'exposition en Three.js, dans les couleurs et les règles de ma marque (voir le Brand OS du projet). Murs clairs, angles droits, éclairage doux, rien de décoratif.

• Les œuvres : les 20 photos de studio du dossier public/galerie/, recadrées au ras du cadre. Accroche-les dans l'ordre de publication : mur de gauche, mur du fond, puis mur de droite. Donne à chaque tableau l'épaisseur de son cadre et une ombre légère sur le mur. Si j'ajoute des œuvres, la salle s'agrandit toute seule.

• Les contrôles : ZQSD, WASD ou flèches pour marcher, souris pour regarder, clic sur une œuvre pour s'approcher, Échap pour faire une pause. Sur téléphone, un joystick à gauche pour marcher et le pouce droit pour regarder.

• Les cartels : à côté de chaque œuvre, son titre, son année et sa technique. Quand on s'approche, une fiche s'ouvre avec l'histoire de l'œuvre et le lien vers sa publication Instagram. Les flèches passent à l'œuvre suivante.

• L'entrée : une pancarte qui présente la série, et un compteur d'œuvres vues.

• Le contenu : toutes les infos des œuvres dans un seul fichier, facile à compléter sans toucher au code.

• L'accessibilité : une version en liste pour qui ne veut pas de 3D, et le mouvement réduit respecté.

Vérifie le rendu sur ordinateur et sur téléphone avant de me rendre la main.`,
  },
  result: {
    title: "Le résultat",
    text: "Une salle à parcourir comme dans un jeu, avec les vingt œuvres accrochées dans l'ordre de leur publication.",
    image: { src: "/guide/galerie.jpg", alt: "La galerie en 3D : une salle blanche, les tableaux accrochés sur les murs, la pancarte de la série au premier plan" },
    cta: "Entrer dans la galerie",
    href: "/galerie/",
  },
};
