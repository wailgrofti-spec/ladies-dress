import { Review } from '../types';

// Témoignages affichés dans la section "Elles nous font confiance" /
// "They trust us" de la page d'accueil.
//
// Important : ce sont des contenus statiques gérés par l'administrateur,
// PAS un système d'avis clients — la boutique n'en propose pas (aucun
// visiteur ne peut publier d'avis depuis le site).
//
// ➕ Pour ajouter un témoignage : ajoutez une ligne ci-dessous.
// ➖ Pour en retirer un : supprimez la ligne correspondante.
export const homeTestimonials: Review[] = [
  { id: 'r1', product_id: null, customer_name: 'Salma, Casablanca', rating: 5, comment: 'Livraison rapide et chaussures magnifiques, exactement comme sur les photos !', is_approved: true, created_at: new Date().toISOString() },
  { id: 'r2', product_id: null, customer_name: 'Imane, Rabat', rating: 5, comment: 'Très bonne qualité, je recommande vivement cette boutique.', is_approved: true, created_at: new Date().toISOString() },
  { id: 'r3', product_id: null, customer_name: 'Fatima Zahra, Marrakech', rating: 4, comment: 'Jolies sneakers, confortables. Le service client sur WhatsApp est très réactif.', is_approved: true, created_at: new Date().toISOString() },
  { id: 'r4', product_id: null, customer_name: 'Nawal', rating: 5, comment: 'Exactement ma pointure habituelle, très confortable dès le premier jour.', is_approved: true, created_at: new Date().toISOString() },
  { id: 'r5', product_id: null, customer_name: 'Khadija', rating: 4, comment: 'Jolie sneaker, un peu large donc je conseille de prendre une demi-pointure en moins.', is_approved: true, created_at: new Date().toISOString() },
  { id: 'r6', product_id: null, customer_name: 'Meryem', rating: 5, comment: "Parfait pour un mariage, très élégant et pas du tout douloureux malgré le talon.", is_approved: true, created_at: new Date().toISOString() },
  { id: 'r7', product_id: null, customer_name: 'Asmaa', rating: 3, comment: 'Jolie bottine mais le cuir a mis du temps à s\u2019assouplir.', is_approved: true, created_at: new Date().toISOString() },
];
