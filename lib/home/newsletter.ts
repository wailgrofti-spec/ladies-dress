// Configuration de la section newsletter de l'accueil.
// Les textes (titre, sous-titre, placeholder, bouton) restent dans
// messages/*.json (clé "home.newsletter...").
//
// Ce fichier est l'endroit où brancher plus tard un vrai service d'emailing
// (Mailchimp, Brevo, etc.) : ajoutez l'identifiant de liste ici et
// utilisez-le dans components/home/Newsletter.tsx.
export const newsletterConfig = {
  enabled: true,
  // provider: 'mailchimp' | 'brevo' | null — à activer plus tard
  provider: null as string | null,
  listId: '',
};
