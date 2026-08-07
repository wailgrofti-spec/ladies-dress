# Dossier des photos produits

Chaque produit a son propre dossier ici, organisé par catégorie :

```
public/products/{catégorie}/{slug-du-produit}/
```

## Comment ajouter vos vraies photos

1. Ouvrez le dossier du produit concerné (ex: `espadrilles/sneaker-blanche-classic/`)
2. Déposez vos photos en les nommant `1.jpg`, `2.jpg`, `3.jpg`... (la photo `1.jpg` sera l'image principale)
3. Ouvrez le fichier du produit correspondant dans `lib/products/{catégorie}/{slug}.ts`
4. Remplacez `imageSeeds: ['photo-xxxx']` par les chemins locaux, par exemple :

```ts
imageSeeds: [
  '/products/espadrilles/sneaker-blanche-classic/1.jpg',
  '/products/espadrilles/sneaker-blanche-classic/2.jpg',
],
```

## Pourquoi ces dossiers sont vides pour le moment

Les produits de démonstration utilisent actuellement des photos temporaires
(Unsplash, libres de droits) référencées directement par lien internet dans
le code — le site s'affiche donc normalement même sans photo ici. Ces
dossiers sont prêts à recevoir vos vraies photos dès que vous les aurez ;
il vous suffira de suivre les 4 étapes ci-dessus, produit par produit.

Une fois Supabase connecté, l'upload de photos se fait plus simplement
encore, directement depuis `/admin/produits` (glisser-déposer, compression
automatique, stockage sur Supabase Storage) — ces dossiers locaux ne seront
alors utiles que pour vos toutes premières photos de test.
