// Page « Méthode » : le brand engineering, le Brand OS dans sa version actuelle, le process du studio.
// Voix : brand/BRAND.md, section 4. Aucun prix sur cette page (section 6).

export const METHODE = {
  eyebrow: "Méthode",
  title: "Le brand engineering.",
  intro:
    "Une marque se juge à l'œil. Elle se tient avec des règles. Le brand engineering réunit les deux : le jugement du directeur artistique et la rigueur de l'ingénieur.",
};

export const ENGINEERING = {
  eyebrow: "Ce que c'est",
  title: "Piloter une marque comme un système.",
  text: [
    "Une charte classique décrit la marque. Elle est livrée en PDF, puis elle dort. Chacun l'interprète, et la marque se dilue à chaque nouveau support.",
    "Le brand engineering l'écrit en règles. Des règles assez précises pour qu'un humain, un outil ou un agent IA les applique juste, sans nous. Chaque règle a une raison, une version et un responsable.",
  ],
  pairs: [
    { not: "Une charte en PDF", yes: "Un dossier de règles, versionné" },
    { not: "« Un ton chaleureux »", yes: "« Vouvoiement, phrases courtes, aucun point d'exclamation »" },
    { not: "Des faits qui varient d'un support à l'autre", yes: "Une seule source pour les noms, les chiffres, les dates" },
    { not: "Une IA qui improvise", yes: "Une IA qui applique, et qui demande quand elle ne sait pas" },
  ],
  principles: [
    { title: "L'œil tranche", text: "Le système applique les décisions. Il ne les prend pas. Le logo, la piste visuelle, le ton : c'est un jugement humain." },
    { title: "Tout est écrit", text: "Ce qui n'est pas écrit se réinvente à chaque fois. Une règle vague devient une règle vérifiable." },
    { title: "Tout se vérifie", text: "Un texte se note avant publication. Un changement se teste avant d'entrer dans la marque." },
  ],
};

export const BRAND_OS = {
  eyebrow: "Le Brand OS",
  title: "Ce que vous recevez, et comment il vit.",
  intro: "Le Brand OS est le dossier de règles livré à la fin de la mission. Il vous appartient. Il tourne dans vos outils, et vous le faites évoluer seul.",
  contents: [
    { name: "Brand Core", text: "Le noyau, la voix, le lexique, les invariants. Une version lisible pour votre équipe, une version compacte pour les agents." },
    { name: "Faits", text: "La seule source des noms, chiffres et dates. Les faits publics sont séparés des faits internes, qui ne sortent jamais." },
    { name: "Tokens", text: "Couleurs en RVB et en CMJN, typographies, espacements. Les mêmes valeurs pour le site, l'imprimé et le code." },
    { name: "Fichiers statiques", text: "Logos RVB et CMJN, favicons, guide de marque en PDF. Générés depuis la source, jamais retouchés à la main." },
    { name: "Tests", text: "Une grille de notation, des textes de référence, des tâches à rejouer. Pour mesurer qu'un changement n'abîme rien." },
    { name: "Journal", text: "Chaque version, ce qui a changé, pourquoi, et qui l'a validé. On ajoute, on n'efface jamais." },
  ],
  where: {
    title: "Où il tourne",
    items: [
      { name: "Dans Claude", text: "Un plugin à importer une fois. Quatre commandes : écrire dans la marque, vérifier avant de publier, l'appliquer dans un site, la faire évoluer." },
      { name: "Dans ChatGPT", text: "Un kit pour créer votre GPT de marque, avec les mêmes règles et les mêmes faits." },
      { name: "Dans votre code", text: "Les tokens, le CSS et les composants s'installent dans vos sites. Un audit signale chaque écart à la marque." },
      { name: "Sans compte IA", text: "Tout s'ouvre aussi en fichiers texte, en pages autonomes et en PDF. Personne n'est exclu de la marque." },
    ],
  },
  levels: {
    title: "Comment il évolue",
    intro: "Chaque changement est classé, testé, validé puis daté. Le Brand OS passe en nouvelle version, et vos outils la reçoivent.",
    items: [
      { n: "1", name: "Un fait", text: "Un prix, une adresse, un nom. Vous le changez seul, il passe dès que les contrôles sont au vert." },
      { n: "2", name: "Une expression", text: "Une formule, un mot du lexique. Le propriétaire de la marque valide." },
      { n: "3", name: "Un ton ou un visuel", text: "Une couleur, une police, la façon de parler. Le changement est testé à l'aveugle avant d'être validé." },
      { n: "4", name: "Le noyau", text: "La promesse, la cible, le positionnement, le nom. Ça ne se change pas seul : c'est un atelier avec le studio." },
    ],
  },
};

export const PROCESS = {
  eyebrow: "Le process",
  title: "Une étape, un jalon. Rien n'avance sans votre accord.",
  intro: "Stratégie et identité sortent de la même main. Chaque étape se termine par une validation. Deux allers-retours au plus par livrable : on tranche, puis on avance.",
  steps: [
    {
      name: "Diagnostic",
      text: "Un regard extérieur sur ce qui existe : votre site, vos réseaux, vos concurrents, ce que les IA disent de vous. Deux forces à garder, trois problèmes au plus, chacun avec sa décision. Et un avis franc : si le Brand OS ne vous est pas utile, on vous le dit.",
      jalon: "La note de diagnostic",
    },
    {
      name: "Cadrage",
      text: "Un questionnaire, puis un atelier de deux heures. Vos derniers clients, ce que vous n'êtes pas, vos chiffres réels. On repart avec vos mots exacts, pas avec une interprétation.",
      jalon: "Le dossier de contexte",
    },
    {
      name: "Positionnement et modèle économique",
      text: "La phrase de marque, la promesse, les valeurs et ce qu'elles interdisent. En parallèle, le modèle économique : chaque recommandation est chiffrée, pas seulement argumentée.",
      jalon: "La phrase de marque et les chiffres",
    },
    {
      name: "Nom, identité, communication",
      text: "Le nom si la mission l'inclut, avec ses vérifications. Deux pistes visuelles au plus, une recommandation tranchée. Les territoires, les canaux et le plan des trois premiers mois.",
      jalon: "Le nom, la piste, les canaux",
    },
    {
      name: "Système et règles",
      text: "Le logo, dessiné à la main par le studio. Le système visuel et son guide. La voix réécrite en règles vérifiables, testée à l'aveugle face à une IA sans règles. Les textes fondateurs, lisibles par les moteurs et par les IA.",
      jalon: "Le dossier complet",
    },
    {
      name: "Livraison du Brand OS",
      text: "Une séance d'une heure trente. Vous produisez de vrais contenus avec vos règles, et vous faites vous-même une première mise à jour du Brand OS. Trente jours plus tard, on vérifie que la marque tient sans nous.",
      jalon: "La remise, puis le point à trente jours",
    },
  ],
  after: {
    title: "Et après",
    text: "Le studio fonde, il ne fait pas tourner. Il s'arrête quand la marque tient seule. Si vous voulez un regard régulier, le Sparring vous donne un jour de conseil par mois.",
  },
};
