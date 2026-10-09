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
- Cas clients (visuels, palettes, polices, règles, erreurs du brand-check) : `content/clients.ts`
- Visuels : `public/travaux/<client>/`
- Adresse e-mail du bouton de contact : `CONTACT_EMAIL` dans `content/site.ts` (vide pour l'instant, le bouton reste masqué)
- Marque Studio Rayas : `brand/` (ne pas modifier à la main, voir `brand/BRAND.md`)

## Animations

GSAP et ScrollTrigger. Le hero, le manifeste et la séquence Brand OS sont épinglés au défilement. Tout se coupe quand le visiteur demande moins de mouvement.
