export const USERS = [
  { id: 1, nom: "Ahmed Mansouri", email: "ahmed@email.com", role: "prestataire", statut: "actif", ville: "Tunis", telephone: "+216 22 345 678", dateInscription: "12 Jan 2024", note: 4.8, services: ["Plomberie", "Sanitaire"] },
  { id: 2, nom: "Yasmine Ben Ali", email: "yasmine@email.com", role: "client", statut: "actif", ville: "Sfax", telephone: "+216 55 123 456", dateInscription: "20 Jan 2024" },
  { id: 3, nom: "Karim Dridi", email: "karim@email.com", role: "prestataire", statut: "bloqué", ville: "Sousse", telephone: "+216 98 765 432", dateInscription: "5 Fév 2024", note: 3.9, services: ["Électricité"] },
  { id: 4, nom: "Sana Lahmar", email: "sana@email.com", role: "client", statut: "actif", ville: "Bizerte", telephone: "+216 25 987 654", dateInscription: "10 Fév 2024" },
  { id: 5, nom: "Amine Trabelsi", email: "amine@email.com", role: "prestataire", statut: "en attente", ville: "Monastir", telephone: "+216 20 111 222", dateInscription: "15 Mar 2024", note: 0, services: ["Peinture", "Rénovation"] },
  { id: 6, nom: "Nour Hamdi", email: "nour@email.com", role: "client", statut: "actif", ville: "Nabeul", telephone: "+216 52 333 444", dateInscription: "22 Mar 2024" },
  { id: 7, nom: "Tarek Slim", email: "tarek@email.com", role: "prestataire", statut: "actif", ville: "Tunis", telephone: "+216 21 555 666", dateInscription: "1 Avr 2024", note: 4.5, services: ["Jardinage", "Nettoyage"] },
];

export const DOCUMENTS = [
  { id: 1, prestataire: "Ahmed Mansouri", prestataireId: 1, type: "CIN", fichier: "cin_ahmed.pdf", date: "12 Jan 2024", statut: "accepté" },
  { id: 2, prestataire: "Ahmed Mansouri", prestataireId: 1, type: "Diplôme", fichier: "diplome_ahmed.pdf", date: "12 Jan 2024", statut: "accepté" },
  { id: 3, prestataire: "Amine Trabelsi", prestataireId: 5, type: "CIN", fichier: "cin_amine.pdf", date: "15 Mar 2024", statut: "en attente" },
  { id: 4, prestataire: "Amine Trabelsi", prestataireId: 5, type: "Diplôme", fichier: "diplome_amine.pdf", date: "15 Mar 2024", statut: "en attente" },
  { id: 5, prestataire: "Amine Trabelsi", prestataireId: 5, type: "Attestation", fichier: "attest_amine.pdf", date: "15 Mar 2024", statut: "refusé" },
  { id: 6, prestataire: "Karim Dridi", prestataireId: 3, type: "CIN", fichier: "cin_karim.pdf", date: "5 Fév 2024", statut: "accepté" },
];

export const CATEGORIES = [
  { id: 1, nom: "Plomberie", icon: "🔧", description: "Réparation et installation de plomberie", sousCategories: ["Dépannage urgent", "Installation sanitaire", "Débouchage"], actif: true, nbPrestataires: 12 },
  { id: 2, nom: "Électricité", icon: "⚡", description: "Travaux électriques et dépannage", sousCategories: ["Installation", "Dépannage", "Tableaux électriques"], actif: true, nbPrestataires: 8 },
  { id: 3, nom: "Peinture", icon: "🎨", description: "Peinture intérieure et extérieure", sousCategories: ["Intérieure", "Extérieure", "Décorative"], actif: true, nbPrestataires: 15 },
  { id: 4, nom: "Jardinage", icon: "🌿", description: "Entretien des espaces verts", sousCategories: ["Tonte", "Taille", "Aménagement"], actif: false, nbPrestataires: 5 },
  { id: 5, nom: "Nettoyage", icon: "✨", description: "Nettoyage professionnel", sousCategories: ["Domicile", "Bureau", "Après travaux"], actif: true, nbPrestataires: 20 },
  { id: 6, nom: "Climatisation", icon: "❄️", description: "Installation et maintenance clim", sousCategories: ["Installation", "Maintenance", "Réparation"], actif: true, nbPrestataires: 7 },
];

export const SERVICES = [
  { id: 1, nom: "Plomberie générale", categorie: "Plomberie", sousCategorie: "Dépannage urgent", prestataire: "Ahmed Mansouri", prestataireId: 1, tarif: 50, unite: "heure", ville: "Tunis", note: 4.8, nbAvis: 42, description: "Service rapide de plomberie, disponible 7j/7.", actif: true, image: null },
  { id: 2, nom: "Installation sanitaire complète", categorie: "Plomberie", sousCategorie: "Installation sanitaire", prestataire: "Ahmed Mansouri", prestataireId: 1, tarif: 200, unite: "forfait", ville: "Tunis", note: 4.8, nbAvis: 42, description: "Installation complète de salle de bain et WC.", actif: true, image: null },
  { id: 3, nom: "Dépannage électrique urgent", categorie: "Électricité", sousCategorie: "Dépannage", prestataire: "Karim Dridi", prestataireId: 3, tarif: 60, unite: "heure", ville: "Sousse", note: 3.9, nbAvis: 18, description: "Intervention rapide pour tous problèmes électriques.", actif: true, image: null },
  { id: 4, nom: "Peinture intérieure", categorie: "Peinture", sousCategorie: "Intérieure", prestataire: "Amine Trabelsi", prestataireId: 5, tarif: 15, unite: "m²", ville: "Monastir", note: 0, nbAvis: 0, description: "Peinture soignée avec fourniture de matériaux.", actif: false, image: null },
  { id: 5, nom: "Entretien jardin mensuel", categorie: "Jardinage", sousCategorie: "Tonte", prestataire: "Tarek Slim", prestataireId: 7, tarif: 80, unite: "visite", ville: "Tunis", note: 4.5, nbAvis: 27, description: "Entretien complet de votre jardin chaque mois.", actif: true, image: null },
  { id: 6, nom: "Nettoyage professionnel bureau", categorie: "Nettoyage", sousCategorie: "Bureau", prestataire: "Tarek Slim", prestataireId: 7, tarif: 120, unite: "forfait", ville: "Tunis", note: 4.5, nbAvis: 27, description: "Nettoyage complet de vos espaces professionnels.", actif: true, image: null },
];

export const RENDEZVOUS = [
  { id: 1, client: "Yasmine Ben Ali", clientId: 2, prestataire: "Ahmed Mansouri", prestataireId: 1, service: "Plomberie générale", serviceId: 1, date: "02 Avr 2024", heure: "09:00", statut: "confirmé", adresse: "12 rue Habib Bourguiba, Tunis", note: null, montant: 150 },
  { id: 2, client: "Sana Lahmar", clientId: 4, prestataire: "Ahmed Mansouri", prestataireId: 1, service: "Installation sanitaire complète", serviceId: 2, date: "02 Avr 2024", heure: "14:30", statut: "en attente", adresse: "5 av. de la Liberté, Bizerte", note: null, montant: 200 },
  { id: 3, client: "Nour Hamdi", clientId: 6, prestataire: "Tarek Slim", prestataireId: 7, service: "Entretien jardin mensuel", serviceId: 5, date: "03 Avr 2024", heure: "10:00", statut: "confirmé", adresse: "8 rue des Roses, Nabeul", note: null, montant: 80 },
  { id: 4, client: "Yasmine Ben Ali", clientId: 2, prestataire: "Tarek Slim", prestataireId: 7, service: "Nettoyage professionnel bureau", serviceId: 6, date: "04 Avr 2024", heure: "08:30", statut: "annulé", adresse: "45 av. Mohamed V, Sfax", note: null, montant: 120 },
  { id: 5, client: "Nour Hamdi", clientId: 6, prestataire: "Ahmed Mansouri", prestataireId: 1, service: "Plomberie générale", serviceId: 1, date: "28 Mar 2024", heure: "11:00", statut: "terminé", adresse: "8 rue des Roses, Nabeul", note: 5, montant: 100 },
];

export const AVIS = [
  { id: 1, client: "Yasmine Ben Ali", clientId: 2, prestataire: "Ahmed Mansouri", prestataireId: 1, service: "Plomberie générale", note: 5, commentaire: "Service rapide et professionnel. Je recommande vivement!", date: "28 Mar 2024" },
  { id: 2, client: "Nour Hamdi", clientId: 6, prestataire: "Ahmed Mansouri", prestataireId: 1, service: "Plomberie générale", note: 4, commentaire: "Bon travail, ponctuel et soigné.", date: "25 Mar 2024" },
  { id: 3, client: "Sana Lahmar", clientId: 4, prestataire: "Tarek Slim", prestataireId: 7, service: "Entretien jardin mensuel", note: 5, commentaire: "Excellent prestataire, très compétent!", date: "20 Mar 2024" },
  { id: 4, client: "Nour Hamdi", clientId: 6, prestataire: "Tarek Slim", prestataireId: 7, service: "Nettoyage professionnel bureau", note: 4, commentaire: "Très satisfaite du résultat, bureau impeccable.", date: "15 Mar 2024" },
];

export const NOTIFICATIONS = [
  { id: 1, type: "rdv", message: "Nouveau rendez-vous de Yasmine Ben Ali pour Plomberie générale", date: "il y a 2h", lu: false },
  { id: 2, type: "avis", message: "Vous avez reçu un avis 5 étoiles de Nour Hamdi", date: "il y a 5h", lu: false },
  { id: 3, type: "doc", message: "Vos documents ont été vérifiés et acceptés", date: "hier", lu: true },
];

export const ADMIN_STATS = {
  totalUsers: 142,
  totalPrestataires: 58,
  totalClients: 84,
  totalServices: 317,
  totalRdv: 1284,
  rdvCeMois: 98,
  enAttente: 3,
  revenus: "28 500 DT",
};
