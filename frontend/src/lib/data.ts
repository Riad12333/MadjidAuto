// ============================================
// DONNÉES CENTRALISÉES - MADJIDAUTO
// ============================================

// Types
export interface Car {
    _id: string; // Changed from id: number
    marque: string; // backend field
    modele: string; // backend field
    prix: number; // backend field
    ville?: string; // Optional, might be missing in backend or needs mapping
    km?: number; // Optional
    annee: number; // backend field (as 'annee')
    carburant?: string; // Optional
    version?: string; // backend field
    images: string[]; // backend field
    description?: string; // backend field
    stock?: number;
    showroomId?: string;
    createdAt?: string;

    // Derived or Frontend specific (allow them for compatibility, but mark as optional if not in backend)
    id?: number;
    brand?: string;
    model?: string;
    price?: string | number;
    city?: string;
    year?: number;
    fuel?: string;
    transmission?: string;
    image?: string;
    isNew?: boolean;
    date?: string;
}

export interface Showroom {
    id: number;
    name: string;
    city: string;
    cars: number;
    phone?: string;
    address?: string;
    image: string;
    rating?: number;
}

export interface NewsArticle {
    id: number;
    title: string;
    excerpt: string;
    date: string;
    image: string;
    category: string;
    slug: string;
}

// Données
// Données MOCK (Mises à jour pour compatibilité type)
// Note: En mode "connecté", ces données seront remplacées par l'API
export const CARS: Car[] = [
    {
        _id: "1", id: 1, brand: "RENAULT", marque: "RENAULT", model: "Clio 5", modele: "Clio 5",
        price: "2 450 000 DA", prix: 2450000, city: "Alger", ville: "Alger",
        km: 5000, year: 2024, annee: 2024, fuel: "Essence", carburant: "Essence",
        transmission: "Manuelle", image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400", images: ["https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400"],
        isNew: false, date: "Il y a 2 jours"
    },
    // ... Autres mocks simplifiés pour éviter erreurs TS pendant la transition
];

export const SHOWROOMS: Showroom[] = [
    { id: 1, name: "Concession Renault Alger Centre", city: "Alger", cars: 45, phone: "+213 21 XX XX XX", address: "123 Avenue de l'Indépendance, Alger", image: "https://images.unsplash.com/photo-1567449303078-57ad995bd329?w=400", rating: 4.8 },
    { id: 2, name: "Auto Hyundai Oran", city: "Oran", cars: 32, phone: "+213 41 XX XX XX", address: "45 Boulevard Front de Mer, Oran", image: "https://images.unsplash.com/photo-1562418043-e4b9c2a6b1a6?w=400", rating: 4.6 },
    { id: 3, name: "Peugeot Constantine", city: "Constantine", cars: 28, phone: "+213 31 XX XX XX", address: "78 Rue Didouche Mourad, Constantine", image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400", rating: 4.7 },
    { id: 4, name: "KIA Motors Annaba", city: "Annaba", cars: 22, phone: "+213 38 XX XX XX", address: "12 Route Nationale, Annaba", image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400", rating: 4.5 },
    { id: 5, name: "Toyota Blida", city: "Blida", cars: 35, phone: "+213 25 XX XX XX", address: "56 Avenue de la Liberté, Blida", image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=400", rating: 4.9 },
    { id: 6, name: "FIAT Algérie Tlemcen", city: "Tlemcen", cars: 18, phone: "+213 43 XX XX XX", address: "34 Rue des Oliviers, Tlemcen", image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400", rating: 4.4 },
];

export const NEWS: NewsArticle[] = [
    { id: 1, title: "Nouveau Renault Duster 2025 disponible en Algérie", excerpt: "Le nouveau Duster arrive avec un design révolutionnaire et des motorisations hybrides. Découvrez les prix.", date: "Il y a 1 semaine", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", category: "Nouveautés", slug: "renault-duster-2025" },
    { id: 2, title: "Tarifs Hyundai Tucson révisés pour 2025", excerpt: "Hyundai Algérie annonce de nouveaux tarifs compétitifs pour le Tucson.", date: "Il y a 5 mois", image: "https://images.unsplash.com/photo-1622186477895-f2af6a0f5a97?w=400", category: "Prix", slug: "hyundai-tucson-2025" },
    { id: 3, title: "FIAT lance la Grande Panda fabriquée à Oran", excerpt: "Premier véhicule 100% assemblé en Algérie, la Grande Panda marque une étape historique.", date: "Il y a 2 semaines", image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400", category: "Industrie", slug: "fiat-grande-panda" },
    { id: 4, title: "Importation véhicules moins de 3 ans : Nouvelles conditions", excerpt: "Le ministère du Commerce publie les nouvelles modalités d'importation.", date: "Il y a 3 jours", image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400", category: "Réglementation", slug: "importation-moins-3-ans" },
    { id: 5, title: "Toyota Yaris 2026 : Caractéristiques et prix", excerpt: "La nouvelle Toyota Yaris débarque avec des technologies avancées.", date: "Il y a 1 mois", image: "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=400", category: "Nouveautés", slug: "toyota-yaris-2026" },
    { id: 6, title: "Projet usine Hyundai en Algérie : Les détails", excerpt: "Le projet d'usine Hyundai en partenariat avec Bahwan avance.", date: "Il y a 6 mois", image: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=400", category: "Industrie", slug: "usine-hyundai-algerie" },
];

export const BRANDS = [
    { name: "Renault", logo: "/brands/renault.png" },
    { name: "Peugeot", logo: "/brands/peugeot.png" },
    { name: "Dacia", logo: "/brands/dacia.png" },
    { name: "Volkswagen", logo: "/brands/volkswagen.png" },
    { name: "Hyundai", logo: "/brands/hyundai.png" },
    { name: "Kia", logo: "/brands/kia.png" },
    { name: "Toyota", logo: "/brands/toyota.png" },
    { name: "Fiat", logo: "/brands/fiat.png" }
];

export const CITIES = [
    "Alger", "Oran", "Constantine", "Annaba", "Blida", "Sétif",
    "Batna", "Tlemcen", "Djelfa", "Béjaïa"
];

export const PRICE_RANGES = [
    "Moins de 1M DA",
    "1M - 2M DA",
    "2M - 3M DA",
    "3M - 5M DA",
    "Plus de 5M DA"
];

export const CATEGORIES = [
    "Nouveautés",
    "Prix",
    "Industrie",
    "Réglementation",
    "Essais"
];

export const CATEGORY_COLORS: Record<string, string> = {
    "Nouveautés": "bg-blue-500",
    "Prix": "bg-green-500",
    "Industrie": "bg-purple-500",
    "Réglementation": "bg-orange-500",
};
