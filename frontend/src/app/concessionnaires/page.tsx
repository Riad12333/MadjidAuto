"use client";

import HeaderModern from "../components/layout/HeaderModern";
import Footer from "../components/layout/Footer";
import PageHeader from "../components/shared/PageHeader";
import GlassCard from "../components/ui/GlassCard";
import { Building2, Search, MapPin, Phone, Star, ArrowRight } from "lucide-react";
import { SHOWROOMS, CITIES } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { useState, useEffect } from "react";

export default function ConcessionnairesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [showrooms, setShowrooms] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchShowrooms = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/showrooms');
                if (res.ok) {
                    const data = await res.json();
                    setShowrooms(data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchShowrooms();
    }, []);

    // Filter logic
    const filteredShowrooms = showrooms.filter(showroom => {
        const matchesSearch = searchTerm === "" ||
            showroom.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            showroom.ville.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCity = selectedCity === "" || showroom.ville === selectedCity;

        return matchesSearch && matchesCity;
    });

    const uniqueCities = Array.from(new Set(showrooms.map(s => s.ville).filter(Boolean)));

    const getImageUrl = (url: string) => {
        if (!url) return "";
        if (url.startsWith('http')) return url;
        return `http://localhost:5000${url}`;
    };

    if (isLoading) return <div className="min-h-screen pt-32 text-center">Chargement...</div>;

    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <HeaderModern />

            <PageHeader
                icon={Building2}
                badge="Réseau Officiel"
                title="Nos"
                highlight="Concessionnaires"
                description="Découvrez les meilleurs showrooms et concessionnaires agréés à travers l'Algérie."
            />

            <section className="py-12 max-w-7xl mx-auto px-6">
                {/* Search & Filter Bar */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 mb-12 -mt-20 relative z-20">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher un concessionnaire..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] transition-all"
                            />
                        </div>
                        <select
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl md:w-64 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35]"
                        >
                            <option value="">Toutes les villes</option>
                            {uniqueCities.map((city: any) => <option key={city} value={city}>{city}</option>)}
                        </select>
                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setSelectedCity("");
                            }}
                            className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all"
                        >
                            Réinitialiser
                        </button>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredShowrooms.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-500 text-lg">Aucun concessionnaire trouvé avec ces critères.</p>
                        </div>
                    ) : (
                        filteredShowrooms.map((showroom, index) => (
                            <motion.div
                                key={showroom._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <GlassCard className="h-full hover:border-[#FF6B35]/30">
                                    <div className="relative h-48 bg-gray-200 overflow-hidden">
                                        {showroom.coverImage ? (
                                            <img src={getImageUrl(showroom.coverImage)} alt={showroom.nom} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : showroom.logo ? (
                                            <img src={getImageUrl(showroom.logo)} alt={showroom.nom} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                                                <Building2 className="w-12 h-12" />
                                            </div>
                                        )}

                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-[#FF6B35] text-xs font-bold shadow-sm">
                                            <Star className="w-3 h-3 fill-current" /> {showroom.rating || 0}
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="space-y-4 mb-6">
                                            <h3 className="text-xl font-bold mb-1">{showroom.nom}</h3>

                                            <div className="flex items-start gap-3">
                                                <MapPin className="w-5 h-5 text-[#FF6B35] shrink-0" />
                                                <p className="text-sm text-gray-600 line-clamp-2">{showroom.adresse ? showroom.adresse + ', ' : ''} {showroom.ville}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Phone className="w-5 h-5 text-[#FF6B35] shrink-0" />
                                                <p className="text-sm font-medium text-gray-900">{showroom.telephone}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold uppercase rounded-full">
                                                {showroom.carsCount || 0} Véhicules
                                            </span>
                                            <Link
                                                href={`/concessionnaires/${showroom._id}`}
                                                className="flex items-center gap-1 text-[#FF6B35] font-bold text-sm hover:gap-2 transition-all"
                                            >
                                                Voir le stock <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
