"use client";

import HeaderModern from "../components/layout/HeaderModern";
import Footer from "../components/layout/Footer";
import PageHeader from "../components/shared/PageHeader";
import CarCardModern from "../components/shared/CarCardModern";
import { Car, Filter, Search, SlidersHorizontal } from "lucide-react";
import { BRANDS, CITIES, PRICE_RANGES } from "@/lib/data";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

export default function OccasionsPage() {
    const searchParams = useSearchParams();
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedPriceRange, setSelectedPriceRange] = useState("");
    const [sortBy, setSortBy] = useState("recent");
    const [cars, setCars] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Récupérer les voitures depuis l'API
    useEffect(() => {
        const fetchCars = async () => {
            try {
                setLoading(true);
                const res = await fetch('http://localhost:5000/api/cars?limit=1000&isNew=false');
                const data = await res.json();
                setCars(data.cars || []);
                setError("");
            } catch (err) {
                console.error('Erreur lors du chargement des voitures:', err);
                setError("Impossible de charger les véhicules");
            } finally {
                setLoading(false);
            }
        };

        fetchCars();
    }, []);

    // Récupérer le terme de recherche et la marque depuis l'URL
    useEffect(() => {
        const search = searchParams.get('search');
        if (search) {
            setSearchTerm(search);
        }
        const brandParam = searchParams.get('marque');
        if (brandParam) {
            setSelectedBrand(brandParam);
        }
    }, [searchParams]);

    // Fonction de filtrage
    const filteredCars = cars.filter(car => {
        // Recherche par mot-clé
        const matchesSearch = searchTerm === "" ||
            car.marque?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            car.modele?.toLowerCase().includes(searchTerm.toLowerCase());

        // Filtre par marque
        const matchesBrand = selectedBrand === "" || car.marque === selectedBrand;

        // Filtre par ville
        const matchesCity = selectedCity === "" || car.ville === selectedCity;

        // Filtre par prix
        let matchesPrice = true;
        if (selectedPriceRange !== "") {
            const price = car.prix;
            switch (selectedPriceRange) {
                case "Moins de 1M DA":
                    matchesPrice = price < 1000000;
                    break;
                case "1M - 2M DA":
                    matchesPrice = price >= 1000000 && price < 2000000;
                    break;
                case "2M - 3M DA":
                    matchesPrice = price >= 2000000 && price < 3000000;
                    break;
                case "3M - 5M DA":
                    matchesPrice = price >= 3000000 && price < 5000000;
                    break;
                case "Plus de 5M DA":
                    matchesPrice = price >= 5000000;
                    break;
            }
        }

        return matchesSearch && matchesBrand && matchesCity && matchesPrice;
    });

    // Fonction de tri
    const sortedCars = [...filteredCars].sort((a, b) => {
        switch (sortBy) {
            case "price-asc":
                return a.prix - b.prix;
            case "price-desc":
                return b.prix - a.prix;
            case "year":
                return b.annee - a.annee;
            default: // recent
                return 0;
        }
    });

    // Pagination
    const itemsPerPage = 9;
    const totalPages = Math.ceil(sortedCars.length / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedCars = sortedCars.slice(startIndex, startIndex + itemsPerPage);

    // Reset page when filters change
    const handleFilterChange = () => {
        setPage(1);
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <HeaderModern />

            <PageHeader
                icon={Car}
                badge="Annonces Vérifiées"
                title="Trouvez votre"
                highlight="prochaine voiture"
                description="Des milliers de véhicules d'occasion contrôlés et garantis disponibles immédiatement."
            />

            <section className="py-12 max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Sidebar Filtres (Glassmorphism) */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-24 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                                <Filter className="w-5 h-5 text-[#FF6B35]" />
                                <h3 className="font-bold text-lg">Filtres</h3>
                            </div>

                            <div className="space-y-6">
                                {/* Recherche */}
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Recherche</label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Modèle, mot-clé..."
                                            value={searchTerm}
                                            onChange={(e) => { setSearchTerm(e.target.value); handleFilterChange(); }}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Marque */}
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Marque</label>
                                    <select
                                        value={selectedBrand}
                                        onChange={(e) => { setSelectedBrand(e.target.value); handleFilterChange(); }}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] transition-all"
                                    >
                                        <option value="">Toutes les marques</option>
                                        {BRANDS.map(brand => <option key={brand.name} value={brand.name}>{brand.name}</option>)}
                                    </select>
                                </div>

                                {/* Ville */}
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Ville</label>
                                    <select
                                        value={selectedCity}
                                        onChange={(e) => { setSelectedCity(e.target.value); handleFilterChange(); }}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] transition-all"
                                    >
                                        <option value="">Toutes les villes</option>
                                        {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                                    </select>
                                </div>

                                {/* Prix */}
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Budget</label>
                                    <select
                                        value={selectedPriceRange}
                                        onChange={(e) => { setSelectedPriceRange(e.target.value); handleFilterChange(); }}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] transition-all"
                                    >
                                        <option value="">Tous les prix</option>
                                        {PRICE_RANGES.map(range => <option key={range} value={range}>{range}</option>)}
                                    </select>
                                </div>

                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setSelectedBrand("");
                                        setSelectedCity("");
                                        setSelectedPriceRange("");
                                        setPage(1);
                                    }}
                                    className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all mt-4"
                                >
                                    Réinitialiser les filtres
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Grille de résultats */}
                    <div className="lg:col-span-3">
                        {/* Toolbar */}
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                            <p className="font-medium text-gray-600">
                                <span className="text-[#1A1A2E] font-bold">{sortedCars.length}</span> résultat{sortedCars.length > 1 ? 's' : ''} trouvé{sortedCars.length > 1 ? 's' : ''}
                            </p>
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-500">Trier par:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#FF6B35]"
                                >
                                    <option value="recent">Plus récents</option>
                                    <option value="price-asc">Prix croissant</option>
                                    <option value="price-desc">Prix décroissant</option>
                                    <option value="year">Année (récent)</option>
                                </select>
                                <button className="lg:hidden p-2 bg-gray-100 rounded-lg">
                                    <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {loading ? (
                                <div className="col-span-full text-center py-12">
                                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#FF6B35] mx-auto mb-4"></div>
                                    <p className="text-gray-500 text-lg">Chargement des véhicules...</p>
                                </div>
                            ) : error ? (
                                <div className="col-span-full text-center py-12">
                                    <p className="text-red-500 text-lg mb-4">{error}</p>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="px-6 py-3 bg-[#FF6B35] hover:bg-[#E85D2E] text-white rounded-xl font-bold transition-all"
                                    >
                                        Réessayer
                                    </button>
                                </div>
                            ) : paginatedCars.length === 0 ? (
                                <div className="col-span-full text-center py-12">
                                    <p className="text-gray-500 text-lg">Aucun véhicule trouvé avec ces critères.</p>
                                    <button
                                        onClick={() => {
                                            setSearchTerm("");
                                            setSelectedBrand("");
                                            setSelectedCity("");
                                            setSelectedPriceRange("");
                                            setPage(1);
                                        }}
                                        className="mt-4 px-6 py-3 bg-[#FF6B35] hover:bg-[#E85D2E] text-white rounded-xl font-bold transition-all"
                                    >
                                        Réinitialiser les filtres
                                    </button>
                                </div>
                            ) : (
                                paginatedCars.map((car, index) => (
                                    <motion.div
                                        key={car._id || car.id || index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <CarCardModern car={car} />
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-12 gap-2">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setPage(p)}
                                        className={`w-10 h-10 rounded-xl font-bold transition-all ${page === p
                                            ? "bg-[#FF6B35] text-white shadow-lg shadow-[#FF6B35]/30"
                                            : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        )}
                        {paginatedCars.length > 0 && (
                            <div className="text-center mt-4 text-gray-500 text-sm">
                                Page {page} sur {totalPages} • {sortedCars.length} résultat{sortedCars.length > 1 ? 's' : ''}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
