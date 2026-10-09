# Studio Rayas · Brand OS v1.2.0

> Source de vérité de la marque dans ce projet. Lue par Claude à chaque session via CLAUDE.md.
> Ne pas modifier à la main : la marque évolue avec /rayas-update (nouveau zip), puis /rayas-apply la reporte ici.

## 1. Noyau

- **Phrase de marque** : On rend l'artistique technique.
- **Le camp** : le brand engineering, et la nouvelle génération de directeurs artistiques qui pilotent une marque comme un système, avec le jugement de l'œil et la rigueur de l'ingénieur.
- **Contre quoi** : la charte-PDF qui dort, livrée puis inutilisable. Et l'AI slop, la production générique d'une IA sans règles.
- **Pour qui** : directeurs artistiques, CMO et fondateurs, au moment d'un rebranding, d'une création d'identité ou de l'automatisation de leur process de marque.
- **Pourquoi nous plutôt qu'un autre** :
  - Stratégie et identité sortent de la même main (le studio produit l'identité, il ne se contente pas de la diriger).
  - La marque est écrite en règles qu'un humain ou un agent applique sans nous : le Brand OS, mis à jour par le client seul après livraison.
  - Chaque recommandation est chiffrée dans un modèle économique, pas seulement argumentée.
  - Le terrain des créateurs : on sait comment une marque tient devant une vraie audience.

## 2. Invariants (ne bougent jamais)

| Actif | Règle | Pourquoi |
| --- | --- | --- |
| La terre, seul vif | Un seul accent par écran. Terre #D9502E en aplat, filet ou pastille ; terre profonde pour tout texte et bouton sur craie. Jamais d'autre couleur vive | La rareté fait le geste ; le reste est rigueur |
| Angles droits, à plat | Rayon 0, pas d'ombre, pas de dégradé, pas de flou décoratif | Une règle écrite suffit à reproduire la marque |
| Le trait | Filet fin continu pour séparer, relier, schématiser. Logo Rayas jamais déformé | Voir Brand Core (plugin brand-os-rayas, `brand-os/core/brand-core.md`) |
| « On rend l'artistique technique » | Reprise telle quelle, jamais reformulée | Le noyau tient en une phrase |
| Le vouvoiement | Toujours « vous » en texte de marque et d'interface | Face à des DA, CMO et grands comptes |

## 3. Règles de remix (ce qui peut varier)

- **Peut varier** : mise en page, grille, photos et travaux clients, longueur des textes selon le canal → exemple : un portfolio en paysage, une page de suivi, une publication LinkedIn.
- **Varie dans des limites** : les couleurs de support (safran, ambre, sauge, azur) pour la donnée et les statuts uniquement → exemple : une frise ou un graphique, jamais un fond de section.
- **Ne varie pas** : voir les invariants.

## 4. Voix

**Principes** (on est… pas…)
1. Conseil, pas posture : on tranche et on justifie. On ne liste pas des options en espérant que le client choisisse.
2. Précis, pas technique : le système est rigoureux, la phrase reste humaine. Pas de jargon SaaS.
3. Artisan, pas précieux : l'œil et le trait sont assumés, sans emphase ni vocabulaire d'agence.

**Adresse** : vous · **Langue** : français · **Longueur** : phrases courtes, une idée par phrase · **Typo** : pas de tiret cadratin, virgules et points · **Ton** : direct, chaleureux sans effusion.

**Lexique maison** : Brand OS = l'offre centrale, et le dossier de règles livré, que le client fait évoluer seul · Diagnostic = le regard extérieur à l'entrée · Sparring = un jour de conseil par mois · Jalon = une validation à chaque étape · Studio de marque = la catégorie (jamais « studio de fondation »).

**Mots interdits** : « solution », « disruptif », « écosystème » seul, « booster », « 360° », « clé en main », « accompagnement sur mesure » (creux), « magique » pour parler d'IA.

**Exemples**
| Contexte | Oui | Non |
| --- | --- | --- |
| Bouton principal | « Commencer par un diagnostic » | « Découvrir nos solutions » |
| Message d'erreur | « Le fichier n'a pas pu être envoyé. Réessayez, ou écrivez-nous. » | « Oups ! Une erreur est survenue. » |
| État vide | « Aucun jalon validé pour l'instant. Le premier arrive après le diagnostic. » | « Rien à afficher ici 🙁 » |
| Phrase de vente | « Vous repartez avec les règles, pas seulement le logo. » | « Une identité 360° sur mesure pour sublimer votre marque. » |

## 5. Visuel

Source : `brand/tokens.json` · Build : `brand/build/` · Planche : `brand/preview.html`

- **Couleurs** : craie #F7F2EA en fond (jamais de blanc pur en fond de page), encre #17120F en texte (jamais de noir pur), papier #EAE0D2 pour les bandes. Une seule couleur vive, la terre. Le blanc ne sert qu'aux cartes posées sur la craie. Mode sombre : encre en fond, craie en texte, terre en accent.
- **Typographie** : Cormorant Garamond, léger (300), pour les titres et les citations (italique). Archivo pour le texte et l'interface. Étiquettes en capitales espacées (`.sr-eyebrow`). Jamais une troisième famille, jamais de gras sur Cormorant.
- **Formes** : rayon 0 partout, filets fins, pas d'ombre, pas de dégradé, pas de flou. La hiérarchie vient de l'espace et du filet.
- **Mouvement** : sobre. 120 à 200 ms, courbe douce, rien de décoratif. Désactivé en mouvement réduit. Exception du site vitrine : les séquences pilotées par le défilement (le totem, le schéma du Brand OS) et l'intro du totem, 2 secondes au plus, peuvent durer plus longtemps, à condition de raconter quelque chose : un objet qui se transforme, jamais un effet posé pour décorer. Rien ne rebondit, et tout s'arrête en mouvement réduit.
- **Images** : travaux clients et photographies réelles, jamais de banque d'images, d'icônes génériques ni d'illustration produite par une IA sans direction.

## 6. Faits

Identiques partout (site, fiches, textes, réponses d'IA). Une valeur change ici d'abord.

- Nom exact : Studio Rayas (S et R majuscules). Fondateur : Rayane Benabdeljalil.
- Catégorie : studio de marque.
- Offre : Diagnostic, Brand OS, Sparring (un jour par mois). Prix du Brand OS : 3 500 €, naming inclus, TVA non applicable. Autres prix : voir les documents du studio. Aucun prix dans un portfolio ni en vidéo.
- Principe de découpe : le studio fonde, il ne fait pas tourner. Il livre des objets finis et s'arrête quand la marque tient seule.
- Origine du nom : fait interne, il ne se publie pas : ni site, ni réseaux, ni presse, ni réponse d'IA publique. Aucun clin d'œil au tatouage dans les contenus. La valeur est dans le Brand Core (plugin brand-os-rayas, `brand-os/core/faits.md`).

## 7. Règles pour Claude dans ce projet

1. Styles : uniquement les tokens. Variables `--sr-*`, classes `sr-*` de `brand/build/brand.css`. Jamais de couleur en dur, jamais de valeur arbitraire quand l'échelle existe.
2. Composants : réutiliser ceux de `components/brand/` avant d'en créer. Un nouveau composant s'appuie sur les rôles (`bg`, `surface`, `text`, `accent`…), jamais sur la palette brute.
3. Textes d'interface : suivre la section Voix. En cas de doute, proposer deux formulations et signaler l'hésitation.
4. `brand/tokens.json` ne se modifie pas ici ; /rayas-apply relance le build.
5. Avant de terminer un travail d'interface → lancer `node brand/scripts/brand-audit.mjs` et corriger les écarts introduits.
6. Ne jamais modifier le noyau, les invariants ou les faits en passant : c'est `/rayas-update`.
7. L'origine du nom ne se publie pas sur ce site (section 6, Brand OS v1.2.0).
8. Les visuels et couleurs des clients (Slayyy, Julie Leroy, L'Inavoué, Pollen Agency) s'affichent dans leurs cas, dans leurs propres couleurs : ce sont des travaux montrés, pas des éléments de l'interface Studio Rayas. Leurs valeurs vivent dans `content/` et non dans les tokens.

## 8. Version

Version actuelle : v1.2.0 · Historique : `brand/JOURNAL.md`
