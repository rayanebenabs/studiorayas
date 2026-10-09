# Studio Rayas · portfolio

Site du studio : le totem et ses cinq services, le Brand OS expliqué au défilement, et quatre cas clients (branding, charte graphique, brand-check à jouer).

## Lancer

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # export statique dans out/
```

## Où modifier quoi

- Textes de la page d'accueil : `content/site.ts`
- Cas clients (textes, palettes, polices, règles, erreurs du brand-check) : `content/clients.ts`
- Images des cas : `content/images.ts` (mode d'emploi en tête du fichier). Fichiers dans `public/travaux/<cas>/`, nommés par emplacement :
  - `collage-1` à `collage-3` : l'ouverture du cas (le 1er sert aussi d'aperçu dans la liste des travaux)
  - `branding-1`, `branding-2`… : la section « Le branding », dans l'ordre de lecture
  - `brand-check` : la photo de la maquette du jeu
  Pour changer une image, remplacez le fichier en gardant son nom. Sinon, changez `src` dans `content/images.ts`.
- Images des cartes de l'accueil (section « Une marque, tous ceux qui la font ») : `public/accueil/`, chemins dans `content/site.ts`
- Adresse e-mail du bouton de contact : `CONTACT_EMAIL` dans `content/site.ts` (vide pour l'instant, le bouton reste masqué)
- Marque Studio Rayas : `brand/` (ne pas modifier à la main, voir `brand/BRAND.md`)

## Animations

GSAP et ScrollTrigger. Le hero, le manifeste et la séquence Brand OS sont épinglés au défilement. Tout se coupe quand le visiteur demande moins de mouvement.
