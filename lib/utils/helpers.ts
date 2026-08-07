import { clsx, ClassValue } from 'clsx';

// Fusionne des classes Tailwind conditionnelles.
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Transforme un texte libre (ex: nom de produit) en URL propre.
// "Sandale Plate Tressée" -> "sandale-plate-tressee"
export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Génère un numéro de commande lisible : LD-YYMMDD-XXXX
export function generateOrderNumber() {
  const date = new Date();
  const y = date.getFullYear().toString().slice(-2);
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `LD-${y}${m}${d}-${rand}`;
}
