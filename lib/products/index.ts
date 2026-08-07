// Index général du catalogue.
// Le reste du projet (lib/data.ts, boutique, recherche, admin...) importe
// uniquement depuis ce fichier — il n'a jamais besoin de savoir que les
// produits sont organisés en sous-dossiers par catégorie.
//
// ➕ Pour ajouter une TOUTE NOUVELLE catégorie plus tard :
//    1. Créez lib/products/ma-nouvelle-categorie/ (avec un index.ts)
//    2. Ajoutez-la à `categories` dans lib/products/categories.ts
//    3. Importez-la et ajoutez-la à `allProducts` ci-dessous
import { espadrillesProducts } from './espadrilles';
import { ballerinesProducts } from './ballerines';
import { talonsProducts } from './talons';
import { mocassinsProducts } from './mocassins';
import { sandalesProducts } from './sandales';

export { categories } from './categories';

export const allProducts = [
  ...espadrillesProducts,
  ...ballerinesProducts,
  ...talonsProducts,
  ...mocassinsProducts,
  ...sandalesProducts,
];
