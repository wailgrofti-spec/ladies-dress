// Offre promotionnelle actuellement active.
//
// Le TEXTE affiché (badge "Offre de lancement -15%...") reste dans
// messages/*.json pour rester traduit en FR/AR/EN. Ce fichier contient la
// donnée structurée correspondante (utile si vous branchez un jour un
// bandeau promo dynamique, ou pour vérifier la cohérence avec le code
// promo réellement actif dans la table `promo_codes` de Supabase).
export const activeOffer = {
  code: 'BIENVENUE15',
  discountPercent: 15,
  active: true,
};
