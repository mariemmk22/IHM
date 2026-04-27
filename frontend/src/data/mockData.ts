export const categories = [
  { id: "1", name: "Plomberie", icon: "🔧", count: 145 },
  { id: "2", name: "Électricité", icon: "⚡", count: 98 },
  { id: "3", name: "Ménage", icon: "🧹", count: 234 },
  { id: "4", name: "Jardinage", icon: "🌿", count: 67 },
  { id: "5", name: "Peinture", icon: "🎨", count: 89 },
  { id: "6", name: "Déménagement", icon: "📦", count: 56 },
  { id: "7", name: "Climatisation", icon: "❄️", count: 43 },
  { id: "8", name: "Serrurerie", icon: "🔑", count: 31 },
];

export const regions = [
  "Alger", "Oran", "Constantine", "Annaba", "Blida",
  "Sétif", "Tlemcen", "Béjaïa", "Batna", "Tizi Ouzou",
];

export const services = [
  {
    id: "1",
    title: "Réparation fuite d'eau",
    provider: "Ahmed Benali",
    category: "Plomberie",
    region: "Alger",
    price: "3 000 DA",
    rating: 4.8,
    reviewCount: 124,
    image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: "2",
    title: "Installation électrique complète",
    provider: "Karim Hadj",
    category: "Électricité",
    region: "Oran",
    price: "8 000 DA",
    rating: 4.9,
    reviewCount: 89,
    image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: "3",
    title: "Nettoyage profond maison",
    provider: "Fatima Zohra",
    category: "Ménage",
    region: "Constantine",
    price: "5 000 DA",
    rating: 4.7,
    reviewCount: 203,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: "4",
    title: "Entretien jardin & taille",
    provider: "Mourad Saidi",
    category: "Jardinage",
    region: "Blida",
    price: "4 000 DA",
    rating: 4.6,
    reviewCount: 56,
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
    available: false,
  },
  {
    id: "5",
    title: "Peinture intérieure appartement",
    provider: "Youcef Bouzid",
    category: "Peinture",
    region: "Alger",
    price: "12 000 DA",
    rating: 4.5,
    reviewCount: 78,
    image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=300&fit=crop",
    available: true,
  },
  {
    id: "6",
    title: "Déménagement local",
    provider: "Omar Ferhat",
    category: "Déménagement",
    region: "Sétif",
    price: "15 000 DA",
    rating: 4.4,
    reviewCount: 34,
    image: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=400&h=300&fit=crop",
    available: true,
  },
];

export const appointments = [
  { id: "1", service: "Réparation fuite d'eau", provider: "Ahmed Benali", date: "2026-04-18", time: "10:00", status: "accepted" as const, address: "12 Rue Didouche, Alger" },
  { id: "2", service: "Nettoyage profond", provider: "Fatima Zohra", date: "2026-04-20", time: "14:00", status: "pending" as const, address: "5 Bd Mohamed V, Constantine" },
  { id: "3", service: "Installation électrique", provider: "Karim Hadj", date: "2026-04-15", time: "09:00", status: "completed" as const, address: "8 Rue Larbi, Oran" },
];

export const reviews = [
  { id: "1", client: "Sara M.", rating: 5, comment: "Excellent travail, rapide et professionnel !", date: "2026-04-10", service: "Plomberie" },
  { id: "2", client: "Ali K.", rating: 4, comment: "Bon service, un peu en retard mais travail de qualité.", date: "2026-04-08", service: "Électricité" },
  { id: "3", client: "Nadia B.", rating: 5, comment: "Très satisfaite, je recommande vivement !", date: "2026-04-05", service: "Ménage" },
];
