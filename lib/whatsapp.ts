// Construit un lien wa.me avec un message pré-rempli.
// Numéro configuré via NEXT_PUBLIC_WHATSAPP_NUMBER (format international, sans +).
export function getWhatsappNumber() {
  return process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '212688526718';
}

export function buildWhatsappLink(message: string) {
  const number = getWhatsappNumber();
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function buildProductWhatsappMessage(params: {
  productName: string;
  size?: string;
  color?: string;
  price: number;
  url: string;
}) {
  const { productName, size, color, price, url } = params;
  const lines = [
    `Bonjour Ladies Dress 👋`,
    `Je souhaite commander :`,
    `• Produit : ${productName}`,
    color ? `• Couleur : ${color}` : null,
    size ? `• Pointure : ${size}` : null,
    `• Prix : ${price} DH`,
    `• Lien : ${url}`,
  ].filter(Boolean);
  return lines.join('\n');
}

export function buildOrderWhatsappMessage(params: {
  orderNumber: string;
  customerName: string;
  city: string;
  total: number;
  items: { name: string; size: string; color: string; quantity: number }[];
}) {
  const { orderNumber, customerName, city, total, items } = params;
  const itemsLines = items
    .map((i) => `  - ${i.name} (${i.color}, pointure ${i.size}) x${i.quantity}`)
    .join('\n');
  return [
    `Bonjour Ladies Dress 👋`,
    `Je viens de passer la commande N°${orderNumber} :`,
    itemsLines,
    `• Cliente : ${customerName}`,
    `• Ville : ${city}`,
    `• Total : ${total} DH`,
  ].join('\n');
}

// Messages envoyés (manuellement, en un clic) à la cliente lors d'un
// changement de statut. Une vraie automatisation "sans clic" nécessite
// l'API WhatsApp Business de Meta (payante, avec vérification d'entreprise) —
// voir README. En attendant, ce lien pré-rempli permet à l'admin de notifier
// la cliente en un seul clic depuis la fiche commande.
const STATUS_MESSAGES: Record<string, (orderNumber: string) => string> = {
  confirmee: (n) => `Bonjour 👋, votre commande N°${n} chez Ladies Dress est confirmée ! Nous préparons votre colis.`,
  en_preparation: (n) => `Bonjour 👋, votre commande N°${n} est en cours de préparation. Elle sera bientôt expédiée.`,
  expediee: (n) => `Bonjour 👋, votre commande N°${n} a été expédiée ! Elle arrive très bientôt.`,
  livree: (n) => `Bonjour 👋, votre commande N°${n} a été livrée. Merci pour votre confiance chez Ladies Dress 💕`,
  annulee: (n) => `Bonjour, votre commande N°${n} a été annulée. N'hésitez pas à nous contacter pour plus d'informations.`,
  refusee: (n) => `Bonjour, nous n'avons pas pu confirmer votre commande N°${n}. Contactez-nous pour en savoir plus.`,
};

export function buildStatusUpdateMessage(status: string, orderNumber: string, customerName?: string) {
  const builder = STATUS_MESSAGES[status];
  const greeting = customerName ? `Bonjour ${customerName} 👋` : 'Bonjour 👋';
  if (!builder) return `${greeting}, mise à jour concernant votre commande N°${orderNumber} chez Ladies Dress.`;
  return builder(orderNumber);
}
