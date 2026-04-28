type ServiceImageInput = {
  nomService?: string | null;
  description?: string | null;
  category?: string | null;
};

const IMAGE_BY_KEYWORD: Array<{ test: RegExp; image: string }> = [
  // Catégories exactes - Priorité haute
  {
    test: /Plomberie/i,
    image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=1200&q=80",
  },
  {
    test: /Électricité/i,
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    test: /Ménage/i,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
  },
  {
    test: /Coiffure.*Beauté|Beauté.*Coiffure/i,
    image: "https://images.unsplash.com/photo-1595777707802-e0175c0a2a7d?auto=format&fit=crop&w=1200&h=600&q=80",
  },
  {
    test: /Transport/i,
    image: "https://images.unsplash.com/photo-1488630466879-bc8f275ceeff?auto=format&fit=crop&w=1200&h=600&q=80",
  },
  
  // Motifs supplémentaires pour les services
  {
    test: /elect|elec|electric|eclairage|courant|disjonct|prise|cabl|c\W*able/i,
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    test: /plomb|canalis|robinet|fuite|eau|lavabo|wc|debouch|sanitaire/i,
    image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=1200&q=80",
  },
  {
    test: /nettoy|menage|propre|hygiene|housekeep/i,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
  },
  {
    test: /jardin|pelouse|haie|arros|plante|green|paysag/i,
    image: "https://images.unsplash.com/photo-1598902108854-10e335adac99?auto=format&fit=crop&w=1200&q=80",
  },
  {
    test: /peint|renov|decor|mur|bati|construction|bricol|maçon|macon/i,
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
  },
  {
    test: /clim|chauff|ventil|air|froid|chaud/i,
    image: "https://images.unsplash.com/photo-1581093458791-9d42e9b6b2f2?auto=format&fit=crop&w=1200&q=80",
  },
  {
    test: /coiff|beaute|cheveux|salon|cosmetic|barber/i,
    image: "https://images.unsplash.com/photo-1595777707802-e0175c0a2a7d?auto=format&fit=crop&w=1200&h=600&q=80",
  },
  {
    test: /transport|demenag|livraison|logistique/i,
    image: "https://images.unsplash.com/photo-1488630466879-bc8f275ceeff?auto=format&fit=crop&w=1200&h=600&q=80",
  },
  {
    test: /repar|maintenance|installation|repair|fix/i,
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
  },
  {
    test: /maison|domicile|home|habita/i,
    image: "https://images.unsplash.com/photo-1554224312-926eeba921e2?auto=format&fit=crop&w=1200&q=80",
  },
];

const DEFAULT_SERVICE_IMAGE =
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80";

export function getServiceImage(service: ServiceImageInput): string {
  const serviceName = (service.nomService ?? "").toLowerCase();
  const description = (service.description ?? "").toLowerCase();
  const category = (service.category ?? "").toLowerCase();

  // Priority matters: first match the concrete service name,
  // then description, and only last the category.
  const byName = IMAGE_BY_KEYWORD.find((entry) => entry.test.test(serviceName));
  if (byName) return byName.image;

  const byDescription = IMAGE_BY_KEYWORD.find((entry) => entry.test.test(description));
  if (byDescription) return byDescription.image;

  const byCategory = IMAGE_BY_KEYWORD.find((entry) => entry.test.test(category));
  return byCategory?.image ?? DEFAULT_SERVICE_IMAGE;
}

export function getCategoryImage(categoryName: string): string {
  const normalized = (categoryName ?? "").toLowerCase();
  const match = IMAGE_BY_KEYWORD.find((entry) => entry.test.test(normalized));
  return match?.image ?? DEFAULT_SERVICE_IMAGE;
}
