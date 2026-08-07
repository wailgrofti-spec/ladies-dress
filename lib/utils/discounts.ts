// Calcule le pourcentage de réduction à afficher (badge "-X%") à partir du
// prix actuel et de l'ancien prix. Retourne null si aucune promotion.
export function discountPercent(price: number, oldPrice: number | null) {
  if (!oldPrice || oldPrice <= price) return null;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}
