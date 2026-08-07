// Point d'entrée unique pour les utilitaires. Les fichiers du projet
// continuent d'importer depuis '@/lib/utils' sans rien changer ; chaque
// fonction vit maintenant dans son propre fichier ci-dessous pour rester
// facile à retrouver (lib/utils/formatPrice.ts, discounts.ts, helpers.ts).
export { formatPrice } from './formatPrice';
export { discountPercent } from './discounts';
export { cn, slugify, generateOrderNumber } from './helpers';
