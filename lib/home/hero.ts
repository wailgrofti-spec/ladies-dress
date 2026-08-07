import { womenBanners } from '../banners/women';

// Données de la section Hero (bannière principale de l'accueil).
//
// Les TEXTES (titre, sous-titre, boutons) restent dans messages/fr.json,
// messages/ar.json, messages/en.json — c'est le système de traduction du
// site (next-intl), seul endroit correct pour du texte visible par les
// clientes (sinon les versions arabe/anglaise cassent).
//
// L'image vient de lib/banners/women.ts (pas dupliquée ici) : c'est là
// qu'il faut la changer.
export const heroImage = womenBanners.hero;
