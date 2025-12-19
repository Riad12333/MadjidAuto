"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight, Play, Gauge, Fuel } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HeroModern() {
    const [stats, setStats] = useState({ adsCount: 0, prosCount: 0 });
    const [searchTerm, setSearchTerm] = useState("");
    const [isMounted, setIsMounted] = useState(false);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const router = useRouter();

    const getImageUrl = (url: string) => {
        if (!url) return "";
        if (url.startsWith('http')) return url;
        const normalizedUrl = url.replace(/\\/g, '/');
        const path = normalizedUrl.startsWith('/') ? normalizedUrl : `/${normalizedUrl}`;
        return `http://127.0.0.1:5000${path}`;
    };

    useEffect(() => {
        setIsMounted(true);
        const fetchStats = async () => {
            try {
                const res = await fetch('http://127.0.0.1:5000/api/stats/public');
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Failed to fetch stats", error);
            }
        };
        fetchStats();
    }, []);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchTerm.length > 2) {
                try {
                    const res = await fetch(`http://127.0.0.1:5000/api/cars/suggestions?q=${encodeURIComponent(searchTerm)}`);
                    if (res.ok) {
                        const data = await res.json();
                        setSuggestions(data);
                        setShowSuggestions(true);
                    }
                } catch (error) {
                    console.error("Error fetching suggestions", error);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        };

        const debounceTimer = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchTerm]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setShowSuggestions(false);
        if (searchTerm.trim()) {
            // Rediriger vers la page occasions avec le terme de recherche
            router.push(`/occasions?search=${encodeURIComponent(searchTerm.trim())}`);
        } else {
            router.push('/occasions');
        }
    };

    return (
        <section className="relative h-screen min-h-[700px] w-full bg-[#1A1A2E]" onClick={() => setShowSuggestions(false)}>
            {/* Background Image (Simulating Video) */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80"
                    alt="Luxury Car Background"
                    fill
                    className="object-cover opacity-60"
                    priority
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A2E] via-[#1A1A2E]/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E] via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="max-w-3xl"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 mb-6">
                        <span className="w-2 h-2 rounded-full bg-[#FF6B35] animate-pulse" />
                        <span className="text-sm font-medium tracking-wide">LA RÉFÉRENCE AUTO EN ALGÉRIE</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-6 tracking-tight font-display">
                        Trouvez la voiture <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#F7931E]">
                            de vos rêves
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-xl leading-relaxed">
                        Accédez au plus grand catalogue de véhicules neufs et d'occasion.
                        Comparez, choisissez et roulez en toute confiance.
                    </p>

                    {/* Search Bar Modern */}
                    <div className="relative max-w-2xl" onClick={e => e.stopPropagation()}>
                        <form onSubmit={handleSearch} className="bg-white/10 backdrop-blur-xl border border-white/20 p-2 rounded-2xl shadow-2xl relative z-20">
                            <div className="flex flex-col md:flex-row gap-2">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Marque, modèle, ou mot-clé..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onFocus={() => {
                                            if (suggestions.length > 0) setShowSuggestions(true);
                                        }}
                                        className="w-full h-14 pl-12 pr-4 bg-white/5 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:bg-white/10 transition-colors border border-transparent focus:border-white/20"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="h-14 px-8 bg-[#FF6B35] hover:bg-[#E85D2E] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#FF6B35]/25 hover:shadow-[#FF6B35]/40 flex items-center justify-center gap-2 group"
                                >
                                    Rechercher
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </form>

                        {/* Suggestions Dropdown */}
                        <AnimatePresence>
                            {showSuggestions && suggestions.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="absolute top-full left-0 right-0 mt-4 bg-white/90 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden z-50 border border-white/40 ring-1 ring-white/50"
                                >
                                    <div className="max-h-[400px] overflow-y-auto no-scrollbar py-2">
                                        {suggestions.map((car: any, index) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                key={car._id}
                                                onClick={() => router.push(`/occasions/${car._id}`)}
                                                className="flex items-center gap-5 p-4 mx-2 hover:bg-white/80 cursor-pointer transition-all rounded-2xl group border border-transparent hover:border-white/50 hover:shadow-lg relative"
                                            >
                                                {/* Image Container */}
                                                <div className="w-24 h-20 rounded-xl bg-gray-200 overflow-hidden flex-shrink-0 relative shadow-sm group-hover:shadow-md transition-all">
                                                    {car.images?.[0] ? (
                                                        <Image
                                                            src={getImageUrl(car.images[0])}
                                                            alt={`${car.marque} ${car.modele}`}
                                                            fill
                                                            unoptimized={true}
                                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                                                            <Search className="w-6 h-6" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="font-bold text-[#1A1A2E] text-lg truncate group-hover:text-[#FF6B35] transition-colors">
                                                                {car.marque} <span className="font-normal">{car.modele}</span>
                                                            </h4>
                                                            <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-900 text-white rounded-full">
                                                                {car.annee}
                                                            </span>
                                                        </div>
                                                        <span className="text-[#FF6B35] font-bold text-lg whitespace-nowrap">
                                                            {car.prix.toLocaleString()} <span className="text-xs text-gray-500 font-normal">DA</span>
                                                        </span>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-2">
                                                        {car.km && (
                                                            <div className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100/80 px-2 py-1 rounded-md">
                                                                <Gauge className="w-3 h-3" />
                                                                {car.km.toLocaleString()} km
                                                            </div>
                                                        )}
                                                        {car.carburant && (
                                                            <div className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100/80 px-2 py-1 rounded-md">
                                                                <Fuel className="w-3 h-3" />
                                                                {car.carburant}
                                                            </div>
                                                        )}
                                                        {car.boite && (
                                                            <div className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100/80 px-2 py-1 rounded-md">
                                                                <span className="w-3 h-3 flex items-center justify-center font-serif italic text-[9px] bg-gray-200 rounded-sm">R</span>
                                                                {car.boite}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Arrow Icon */}
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 transition-all duration-300 bg-white/50 backdrop-blur-sm p-2 rounded-full text-[#FF6B35]">
                                                    <ArrowRight className="w-5 h-5" />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    <div className="p-3 bg-gray-50/50 backdrop-blur-md border-t border-gray-100">
                                        <button
                                            onClick={handleSearch}
                                            className="w-full py-3 bg-[#1A1A2E] hover:bg-[#2A2A4A] text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg group"
                                        >
                                            Voir les {suggestions.length} résultats
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Stats / Trust Indicators */}
                    <div className="mt-12 flex items-center gap-8 text-white/80">
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold text-white">
                                {isMounted ? (stats.adsCount > 1000 ? (stats.adsCount / 1000).toFixed(1) + 'k+' : stats.adsCount) : '0'}
                            </span>
                            <span className="text-xs uppercase tracking-wider text-gray-400">Annonces</span>
                        </div>
                        <div className="w-px h-8 bg-white/20" />
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold text-white">
                                {isMounted ? (stats.prosCount > 1000 ? (stats.prosCount / 1000).toFixed(1) + 'k+' : stats.prosCount) : '0'}
                            </span>
                            <span className="text-xs uppercase tracking-wider text-gray-400">Vendeurs Pro</span>
                        </div>
                        <div className="w-px h-8 bg-white/20" />
                        <div className="flex items-center gap-3 cursor-pointer hover:text-white transition-colors group">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#FF6B35] transition-colors">
                                <Play className="w-4 h-4 fill-current" />
                            </div>
                            <span className="text-sm font-medium">Voir la démo</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#F8F9FA] to-transparent z-20" />
        </section>
    );
}
