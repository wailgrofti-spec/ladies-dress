# Ladies Dress — Boutique en ligne de chaussures pour femmes

Site e-commerce complet (Next.js 14 + TypeScript + Tailwind + Supabase) pour
la boutique **Ladies Dress**, en français / arabe (RTL) / anglais, avec
espace administrateur pour gérer produits, stock, commandes et contenu sans
toucher au code.

## Sommaire
1. [Installation en local](#1-installation-en-local)
2. [Fonctionnement sans Supabase (mode démo)](#2-fonctionnement-sans-supabase-mode-démo)
3. [Configurer Supabase (base de données réelle)](#3-configurer-supabase-base-de-données-réelle)
4. [Créer le premier compte administrateur](#4-créer-le-premier-compte-administrateur)
5. [Déploiement sur Vercel](#5-déploiement-sur-vercel)
6. [Connecter un nom de domaine](#6-connecter-un-nom-de-domaine)
7. [Modifier le nom, le logo, le numéro WhatsApp](#7-modifier-le-nom-le-logo-le-numéro-whatsapp)
8. [Structure du projet](#8-structure-du-projet)
9. [Checklist de test avant mise en ligne](#9-checklist-de-test-avant-mise-en-ligne)

## 🆕 Fonctionnalités premium ajoutées

- **Dashboard avancé** : CA jour/semaine/mois, panier moyen, nouvelles clientes,
  graphique d'évolution des ventes (14 jours), top produits vendus, top villes,
  alertes stock — `/admin/dashboard`
- **Gestion des clientes** (`/admin/clients`) : dérivée automatiquement des
  commandes (regroupées par téléphone), avec statut Nouveau / Fidèle / VIP
  calculé automatiquement, recherche et appel/WhatsApp en un clic
- **Wishlist** (`/[locale]/favoris`) : cœur sur chaque produit, sauvegardé en
  local (pas de compte client requis, cohérent avec le cahier des charges
  initial qui ne prévoyait pas d'espace client)
- **Avis clients avec photos** : par produit, avec upload photo, note moyenne
  affichée, modération admin (`/admin/avis`)
- **Recherche instantanée** : barre de recherche dans le header (nom, couleur,
  pointure, catégorie, prix)
- **Produits récemment consultés** : section automatique en bas des fiches
  produit
- **SEO complet** : `sitemap.xml` et `robots.txt` générés automatiquement
  (tous les produits × 3 langues), balises canonical, hreflang, Open Graph et
  Twitter Cards sur toutes les pages
- **Notifications de statut** : bouton "Notifier la cliente" sur chaque
  commande, avec message WhatsApp pré-rempli et adapté au statut choisi
  (confirmée, expédiée, livrée...)

### ⚠️ Limitations honnêtes à connaître

- **WhatsApp reste "un clic", pas 100% automatique.** Les vraies notifications
  automatiques (envoyées sans action humaine) nécessitent l'API WhatsApp
  Business de Meta, qui est payante et demande une vérification d'entreprise.
  Ce projet génère des liens `wa.me` pré-remplis que l'admin envoie en un
  clic — la meilleure option gratuite disponible.
- **"Produits les plus consultés" et "taux de conversion"** : la table
  `product_views` est déjà créée dans le schéma SQL et le tracking est déjà
  branché sur chaque fiche produit. Ces chiffres deviendront pertinents une
  fois Supabase connecté et du trafic réel accumulé — pas avant, un compteur
  sans données ne raconterait rien d'utile.
- **Pas de page builder visuel.** Vous pouvez modifier tous les textes,
  images, couleurs de contenu et paramètres depuis `/admin`, mais il n'y a
  pas d'éditeur "glisser-déposer" pour recomposer visuellement la mise en
  page — cela reste un projet à part entière (type Webflow).
- **Vidéos produit / 360°** : l'upload d'images est en place (compression via
  Supabase Storage) ; l'upload vidéo n'a pas été ajouté dans cette passe pour
  rester dans un temps raisonnable, mais s'ajoute facilement au même endroit
  que l'upload photo (`components/admin/ProductForm.tsx`).

---

## 1. Installation en local

Prérequis : [Node.js 18+](https://nodejs.org) installé sur votre ordinateur.

```bash
# 1. Installer les dépendances
npm install

# 2. Copier le fichier d'environnement
cp .env.example .env.local

# 3. Lancer le site en local
npm run dev
```

Ouvrez [http://localhost:3000/fr](http://localhost:3000/fr) — le site
fonctionne immédiatement avec **12 produits de démonstration**, même sans
Supabase configuré.

L'espace admin est sur [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

---

## 2. Fonctionnement sans Supabase (mode démo)

Tant que les variables `NEXT_PUBLIC_SUPABASE_URL` et
`NEXT_PUBLIC_SUPABASE_ANON_KEY` ne sont pas renseignées dans `.env.local` :

- La boutique publique affiche automatiquement les **produits de démonstration**
  (`lib/demo-data.ts`) — pratique pour tester le design et le parcours d'achat.
- L'espace admin fonctionne avec un compte de test :
  **email : `admin@ladiesdress.ma`** / **mot de passe : `demo1234`**
- Les modifications faites dans l'admin (ajout produit, statut commande...)
  **ne sont pas sauvegardées** — un message vous le rappelle à chaque action.

➡️ Pour une boutique réelle, configurez Supabase (étape suivante) : le code
bascule alors automatiquement sur la vraie base de données, sans rien changer
au design ni aux pages.

---

## 3. Configurer Supabase (base de données réelle)

1. Créez un compte gratuit sur [supabase.com](https://supabase.com) et un
   nouveau projet.
2. Dans **Project Settings > API**, copiez :
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ gardez-la secrète,
     ne la mettez jamais dans un fichier public ou un dépôt Git accessible)
3. Collez ces valeurs dans `.env.local`.
4. Allez dans **SQL Editor > New query**, collez tout le contenu du fichier
   [`supabase/schema.sql`](./supabase/schema.sql) et cliquez sur **Run**.
   Cela crée toutes les tables, la sécurité (RLS), le bucket de stockage des
   photos, et les données de départ (catégories, villes de livraison, code
   promo de lancement).
5. Redémarrez `npm run dev` (ou redéployez sur Vercel) : le site utilise
   maintenant votre vraie base de données.

Vous pouvez ensuite ajouter vos 12 premiers vrais produits directement
depuis `/admin/produits/nouveau`, avec vos propres photos.

---

## 4. Créer le premier compte administrateur

Supabase Auth gère la connexion de l'espace admin. Pour créer votre compte :

1. Dans Supabase : **Authentication > Users > Add user**.
2. Renseignez votre email et un mot de passe.
3. Connectez-vous ensuite sur `/admin/login` avec ces identifiants.

(Optionnel) Pour lier ce compte à la table `admin_users` du schéma, exécutez
dans le SQL Editor :
```sql
insert into admin_users (id, email)
select id, email from auth.users where email = 'votre-email@exemple.com';
```

---

## 5. Déploiement sur Vercel

1. Poussez ce projet sur un dépôt GitHub.
2. Sur [vercel.com](https://vercel.com), cliquez sur **New Project** et
   importez le dépôt.
3. Dans les paramètres du projet Vercel, ajoutez les mêmes variables
   d'environnement que dans `.env.local` (Settings > Environment Variables).
4. Cliquez sur **Deploy**. Votre site est en ligne en quelques minutes.

---

## 6. Connecter un nom de domaine

1. Achetez votre nom de domaine (ex. via un registrar marocain ou
   international).
2. Dans Vercel : **Project > Settings > Domains**, ajoutez votre domaine
   (ex. `ladiesdress.ma`).
3. Suivez les instructions affichées pour configurer les enregistrements DNS
   (CNAME ou A) chez votre registrar.
4. Mettez à jour `NEXT_PUBLIC_SITE_URL` dans les variables d'environnement
   Vercel avec votre nouveau domaine.

---

## 7. Modifier le nom, le logo, le numéro WhatsApp

Toutes ces informations sont modifiables **sans toucher au code**, depuis
`/admin/contenu` une fois Supabase configuré :
- Nom de la boutique, logo (URL de l'image)
- Titre et sous-titre de la bannière d'accueil
- Numéro WhatsApp et téléphone
- Adresse du magasin physique
- Liens Instagram / Facebook / TikTok
- Identifiants Google Analytics / Meta Pixel / TikTok Pixel

En attendant de connecter Supabase, ces valeurs par défaut sont dans
`.env.local` (`NEXT_PUBLIC_WHATSAPP_NUMBER`) et dans `lib/whatsapp.ts`.

---

## 8. Structure du projet

```
app/[locale]/         → pages publiques (fr / ar / en)
app/admin/             → espace administrateur (protégé)
app/api/                → routes API (commandes, produits, contenu...)
components/              → composants réutilisables (boutique)
components/admin/        → composants réutilisables (admin)
lib/                       → logique métier, types, accès aux données
  data.ts                  → lecture produits/catégories (Supabase ou démo)
  demo-data.ts              → 12 produits de démonstration
  cart-context.tsx           → panier (localStorage)
  whatsapp.ts                  → génération des liens WhatsApp
  admin-auth.tsx                → authentification admin
messages/                → traductions fr.json / ar.json / en.json
supabase/schema.sql       → schéma complet de la base de données
```

L'architecture est pensée pour évoluer : `parent_type` dans la table
`categories` permet d'ajouter plus tard des catégories `vetements`, `sacs`,
`accessoires` sans changer la structure du site.

---

## 9. Checklist de test avant mise en ligne

- [ ] Le site s'affiche correctement en français, arabe (RTL) et anglais
- [ ] Le panier se met à jour correctement (ajout, quantité, suppression)
- [ ] Le tunnel de commande valide bien les champs obligatoires
- [ ] Le bouton WhatsApp génère un message correct (produit et commande)
- [ ] La commande apparaît bien dans `/admin/commandes` après un achat test
- [ ] Le stock diminue bien après confirmation d'une commande
- [ ] Une pointure épuisée apparaît bien indisponible sur la fiche produit
- [ ] L'ajout d'un produit avec photos fonctionne depuis `/admin/produits/nouveau`
- [ ] Le numéro WhatsApp et les coordonnées sont corrects partout
- [ ] Les pages légales (CGV, confidentialité, livraison...) sont à jour
- [ ] Le site est testé sur un vrai téléphone (pas seulement sur ordinateur)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` n'est configurée que dans les variables
      d'environnement du serveur (jamais visible dans le code envoyé au
      navigateur)
- [ ] Créer un produit test dans `/admin/produits/nouveau`, rafraîchir la
      page : il doit toujours être là (preuve que la sauvegarde est réelle)
- [ ] Modifier son stock via les boutons +/-, rafraîchir : le nouveau
      chiffre doit persister, et une ligne doit apparaître dans la table
      Supabase `stock_movements`
- [ ] Appliquer un code promo réel (créé dans `/admin/codes-promo`) dans le
      panier : la réduction doit s'afficher et se répercuter sur le total
- [ ] Changer le prix de livraison d'une ville dans `/admin/parametres`,
      passer une commande vers cette ville : le nouveau tarif doit
      apparaître dans le tunnel de commande

---

## 🔒 Audit "vraies opérations CRUD"

Ce projet a fait l'objet d'un audit dédié pour garantir qu'aucune action
admin ne se contente de modifier l'affichage sans écrire dans Supabase.
Quatre problèmes réels ont été trouvés et corrigés au fil du développement :

1. **Catégories / villes de livraison / codes promo** : certains boutons
   masquer/activer/supprimer ne modifiaient que l'état local React, sans
   jamais appeler la base de données. Corrigé — chaque action appelle
   désormais une vraie route API (`/api/categories/[id]`,
   `/api/shipping-zones/[id]`, `/api/promo-codes/[id]`) qui écrit dans
   Supabase.
2. **Code promo dans le panier** : le bouton "Appliquer" ne faisait
   littéralement rien. Corrigé — `/api/promo-codes/validate` vérifie
   maintenant réellement le code (actif, non expiré, plafond d'utilisation,
   montant minimum) et la réduction s'applique au total.
3. **Frais de livraison** : un montant fixe (25 DH, gratuit dès 500 DH)
   était codé en dur dans le panier et le tunnel de commande, sans lire la
   configuration par ville. Corrigé — `/api/shipping/public` calcule le
   vrai tarif depuis la table `shipping_zones` selon la ville choisie.
4. **Décrémentation du stock** : elle se déclenchait à la création de la
   commande plutôt qu'à sa confirmation par l'admin, contrairement au
   cahier des charges initial. Corrigé — le stock ne bouge que lorsque le
   statut passe à "Confirmée" (et au-delà), et se restitue automatiquement
   si une commande déjà confirmée est ensuite annulée, refusée ou
   retournée (voir les fonctions SQL `decrement_stock` / `increment_stock`
   dans `schema.sql`).

**Limite honnête à connaître** : la génération de ce code s'est faite dans
un environnement sans accès réseau à `supabase.co`, donc il n'a pas été
possible d'exécuter un test live contre un vrai projet Supabase. La
vérification s'est faite par audit du code route par route, vérification
TypeScript stricte (`tsc --noEmit`), et build de production complet — les
deux sans erreur. La checklist ci-dessus permet de confirmer en quelques
minutes, une fois Supabase connecté, que chaque opération persiste bien.

**Note d'architecture** : le cahier des charges mentionnait des "Server
Actions" Next.js. Ce projet utilise des Route Handlers
(`app/api/.../route.ts`) plutôt que des fonctions `'use server'` littérales
— les deux sont des mécanismes Next.js 14 réels et adaptés à la production,
mais ce ne sont pas rigoureusement le même pattern.

---

**Support technique** : ce projet a été généré comme base de départ
fonctionnelle. Pour toute évolution (paiement en ligne réel, API de
livraison, application mobile...), un développeur peut reprendre ce code
directement — il est organisé et commenté à cet effet.
