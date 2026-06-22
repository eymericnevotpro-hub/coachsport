# Coach — Sport & Transformation

Application web mobile (PWA) de suivi sportif : prise de muscle, calisthénie, nutrition, poids et photos avant/après.

> Prototype fonctionnel sans build — HTML / CSS / JavaScript pur. Toutes les données sont stockées **en local** dans le navigateur (`localStorage`). Aucun compte, aucun serveur.

## Écrans

- **Aujourd'hui** — séance du jour, anneaux (calories / protéines / poids), conseil quotidien, série (streak).
- **Training** — bascule *Salle* (log charges, surcharge progressive) / *Calisthénie* (roadmap muscle-up, planche, front lever, handstand).
- **Nutrition** — objectifs caloriques en surplus (profil ectomorphe), ajout de repas, suivi macros.
- **Progrès** — courbe de poids, photos avant/après, skills débloqués, mensurations.
- **Profil** — objectifs, morphotype, objectifs nutrition, couleur d'accent, réinitialisation.

## Lancer en local

C'est un site statique : ouvrez `index.html`, ou servez le dossier :

```bash
npx serve .
```

## Déploiement

Hébergé sur **Vercel** (site statique, racine du repo). Chaque push sur `main` redéploie automatiquement.

## Stack

- HTML / CSS / Vanilla JS — zéro dépendance, zéro étape de build.
- Installable sur mobile (« Ajouter à l'écran d'accueil ») via `manifest.webmanifest`.

## Roadmap

- [ ] Aligner le design pixel-perfect sur la maquette Claude Design (`Coach App.dc.html`).
- [ ] Synchronisation cloud / multi-appareils (optionnel).
- [ ] Rappels / notifications.
