import { categories } from '../products/categories';

// Catégories affichées dans la section "Nos catégories" de l'accueil.
// La liste des catégories elle-même vit dans lib/products/categories.ts
// (source unique, aussi utilisée par la boutique et l'admin) — ce fichier
// se contente de choisir l'ordre d'affichage sur la page d'accueil.
//
// Pour changer l'ORDRE ou choisir de n'en afficher qu'une partie sur la
// home, modifiez ce fichier. Pour ajouter/renommer/supprimer une
// catégorie partout sur le site, modifiez lib/products/categories.ts.
export const homeCategories = categories
  .filter((c) => c.is_active)
  .sort((a, b) => a.sort_order - b.sort_order);
