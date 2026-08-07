// Formatage des prix — uniquement en dirhams marocains (DH), jamais € ou $.
export function formatPrice(amount: number) {
  return `${amount.toLocaleString('fr-FR')} DH`;
}
