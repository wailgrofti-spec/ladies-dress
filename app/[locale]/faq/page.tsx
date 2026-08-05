const faqs = [
  { q: 'Quels sont les délais de livraison ?', a: 'Entre 24h et 72h selon votre ville, du lundi au samedi.' },
  { q: 'Puis-je payer à la livraison ?', a: 'Oui, le paiement à la livraison est disponible partout au Maroc.' },
  { q: 'Comment choisir ma pointure ?', a: 'Consultez notre guide des tailles disponible sur chaque fiche produit. En cas de doute, écrivez-nous sur WhatsApp.' },
  { q: 'Puis-je échanger un article ?', a: 'Oui, sous 7 jours si l\u2019article est inutilisé et dans son emballage d\u2019origine.' },
  { q: 'Comment suivre ma commande ?', a: 'Utilisez la page "Suivi de commande" avec votre numéro de commande, ou écrivez-nous sur WhatsApp.' },
];

export default function FaqPage() {
  return (
    <div className="container-app max-w-2xl py-12">
      <h1 className="font-display text-3xl font-semibold text-charcoal-900">Questions fréquentes</h1>
      <div className="mt-6 space-y-3">
        {faqs.map((f) => (
          <details key={f.q} className="card p-4">
            <summary className="cursor-pointer text-sm font-semibold text-charcoal-800">{f.q}</summary>
            <p className="mt-2 text-sm text-charcoal-700">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
