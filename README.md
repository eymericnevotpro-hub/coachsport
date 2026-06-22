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

## Coach IA (Claude)

Boutons « Coach IA » (accueil / training / nutrition) qui génèrent des conseils, séances et repas personnalisés via l'API Anthropic.

- **Modèle** : `claude-haiku-4-5` (le moins cher — ~1 $ / 1M tokens entrée, 5 $ / 1M sortie). Une génération coûte ≈ 0,3 centime.
- **Sécurité** : la clé n'est **jamais** dans le code client. Elle vit dans la fonction serverless [`api/coach.js`](api/coach.js) via la variable d'environnement **`ANTHROPIC_API_KEY`**.

**Activation (à faire dans Vercel) :**
1. Vercel → projet `coachsport` → **Settings → Environment Variables**.
2. Ajoute `ANTHROPIC_API_KEY` = ta clé Anthropic (Production + Preview).
3. **Redeploy** pour que la clé soit prise en compte.

Tant que la variable n'est pas définie, les boutons affichent un message « pas encore activé » au lieu de planter. Le Coach IA ne fonctionne que sur le site déployé (pas en `serve` local).

## Stack

- HTML / CSS / Vanilla JS — zéro dépendance, zéro étape de build.
- Installable sur mobile (« Ajouter à l'écran d'accueil ») via `manifest.webmanifest`.

## Roadmap

- [ ] Aligner le design pixel-perfect sur la maquette Claude Design (`Coach App.dc.html`).
- [ ] Synchronisation cloud / multi-appareils (optionnel).
- [ ] Rappels / notifications.
