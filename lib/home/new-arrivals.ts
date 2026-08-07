import { Product } from '../types';

// Combien de nouveautés afficher sur la page d'accueil.
export const NEW_ARRIVALS_LIMIT = 4;

// Sélectionne les nouveautés à partir du catalogue réel (Supabase une fois
// connecté, sinon les produits de démonstration). Il n'y a JAMAIS de liste
// de produits séparée ici : cocher "Nouveau" sur un produit depuis
// /admin/produits suffit pour qu'il apparaisse automatiquement ici.
export function getNewArrivals(products: Product[]): Product[] {
  return products.filter((p) => p.is_new).slice(0, NEW_ARRIVALS_LIMIT);
}
