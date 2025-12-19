"use client";
import { API_URL } from "@/lib/config";

import HeaderModern from "../../components/layout/HeaderModern";
import Footer from "../../components/layout/Footer";
import Link from "next/link";
import { MapPin, Gauge, Calendar, Fuel, Shield, CheckCircle, Phone, MessageCircle, Share2, Heart, ArrowLeft, Cog } from "lucide-react";
import { use, useEffect, useState } from "react";

export default function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [car, setCar] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const res = await fetch(`${API_URL}/api/cars/${id}`);
                if (!res.ok) throw new Error("Véhicule non trouvé");
                const data = await res.json();
                setCar(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchCar();
    }, [id]);

    // Check if the car is liked (via user profile)
    useEffect(() => {
        const checkLikeStatus = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const res = await fetch(`${API_URL}/api/users/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.favorites && data.favorites.some((fav: any) => fav._id === id || fav === id)) {
                        setIsLiked(true);
                    }
                }
            } catch (err) {
                console.error("Error checking like status", err);
            }
        };
        if (id) checkLikeStatus();
    }, [id]);

    const toggleLike = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Veuillez vous connecter pour ajouter aux favoris.");
            return;
        }

        try {
            const method = isLiked ? 'DELETE' : 'POST';
            const res = await fetch(`${API_URL}/api/users/favorites/${id}`, {
                method,
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                setIsLiked(!isLiked);
            }
        } catch (err) {
            console.error("Error toggling like", err);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `DzairAuto: ${car.marque} ${car.modele}`,
                    text: `Regarde cette voiture : ${car.marque} ${car.modele} à ${formatPrice(car.prix)}`,
                    url: window.location.href,
                });
            } catch (err) {
                console.log("Error sharing", err);
            }
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert("Lien copié dans le presse-papier !");
        }
    };

    if (loading) return <div className="min-h-screen pt-32 text-center">Chargement...</div>;
    if (error || !car) return <div className="min-h-screen pt-32 text-center text-red-500">Erreur: {error}</div>;

    // Helpers
    const formatPrice = (p: number) => new Intl.NumberFormat('fr-DZ').format(p) + ' DA';
    const formatKm = (k: number) => new Intl.NumberFormat('fr-DZ').format(k) + ' km';
    const getImageUrl = (url: string) => {
        if (!url) return "";
        if (url.startsWith('http')) return url;
        const normalizedUrl = url.replace(/\\/g, '/');
        const path = normalizedUrl.startsWith('/') ? normalizedUrl : `/${normalizedUrl}`;
        return `${API_URL}${path}`;
    };

    // Images logic
    const rawImages = car.images && car.images.length > 0 ? car.images : ["https://via.placeholder.com/800x600?text=Pas+d'image"];
    const images = rawImages.map(getImageUrl);
    const mainImage = images[selectedImageIndex];

    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <HeaderModern />

            {/* Breadcrumb & Back */}
            <div className="pt-24 pb-6 max-w-7xl mx-auto px-6">
                <Link href={car.isNew ? "/voitures-neuves" : "/occasions"} className="inline-flex items-center gap-2 text-gray-500 hover:text-[#FF6B35] transition-colors mb-4">
                    <ArrowLeft className="w-4 h-4" /> Retour {car.isNew ? "aux voitures neuves" : "aux occasions"}
                </Link>
            </div>

            <main className="max-w-7xl mx-auto px-6 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Gallery Hero */}
                        <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 relative h-[400px] md:h-[500px]">
                            <img src={mainImage} alt={car.modele} className="w-full h-full object-cover" />

                            <div className="absolute top-4 right-4 flex gap-2">
                                <button
                                    onClick={handleShare}
                                    className="p-3 bg-white/90 backdrop-blur rounded-full text-gray-700 hover:text-[#FF6B35] transition-colors shadow-lg"
                                    title="Partager"
                                >
                                    <Share2 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={toggleLike}
                                    className={`p-3 bg-white/90 backdrop-blur rounded-full transition-colors shadow-lg ${isLiked ? 'text-red-500' : 'text-gray-700 hover:text-red-500'}`}
                                    title={isLiked ? "Retirer des favoris" : "Ajouter aux favoris"}
                                >
                                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                                </button>
                            </div>

                            {/* Thumbnails */}
                            {images.length > 1 && (
                                <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto pb-2 noscroll">
                                    {images.map((img: string, i: number) => (
                                        <div
                                            key={i}
                                            onClick={() => setSelectedImageIndex(i)}
                                            className={`w-20 h-20 relative rounded-xl overflow-hidden border-2 shadow-lg flex-shrink-0 cursor-pointer hover:scale-105 transition-transform ${selectedImageIndex === i ? 'border-[#FF6B35]' : 'border-white'}`}
                                        >
                                            <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Title & Specs */}
                        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A2E]">
                                            {car.marque} <span className="text-[#FF6B35]">{car.modele}</span>
                                        </h1>
                                        {car.isNew && <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">NEUF</span>}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <MapPin className="w-4 h-4" /> {car.ville} • Publié le {new Date(car.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-[#FF6B35]">{formatPrice(car.prix)}</div>
                                    <div className="text-sm text-gray-400">Négociable</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { icon: Gauge, label: "Kilométrage", value: formatKm(car.km) },
                                    { icon: Calendar, label: "Année", value: car.annee },
                                    { icon: Fuel, label: "Carburant", value: car.carburant },
                                    { icon: Cog, label: "Boîte", value: car.boite },
                                ].map((spec, i) => (
                                    <div key={i} className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center text-center hover:bg-[#FF6B35]/5 transition-colors">
                                        <spec.icon className="w-6 h-6 text-[#FF6B35] mb-2" />
                                        <span className="text-sm text-gray-500 mb-1">{spec.label}</span>
                                        <span className="font-bold text-[#1A1A2E]">{spec.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                            <h2 className="text-xl font-bold text-[#1A1A2E] mb-4">Description du véhicule</h2>
                            <p className="text-gray-600 leading-relaxed mb-6 whitespace-pre-wrap">
                                {car.description || "Aucune description fournie."}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">Couleur: {car.couleur || "Non spécifiée"}</span>
                                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">Version: {car.version || "Standard"}</span>
                            </div>
                        </div>

                    </div>

                    {/* Sidebar Sticky */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">

                            {/* Vendeur Card */}
                            <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-[#1A1A2E] rounded-full flex items-center justify-center text-white font-bold text-xl uppercase">
                                        {car.user?.nom?.[0] || "V"}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{car.user?.prenom} {car.user?.nom}</h3>
                                        <div className="flex items-center gap-1 text-sm text-green-500 font-medium">
                                            <CheckCircle className="w-4 h-4" /> Identité vérifiée
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <a href={`tel:${car.contactPhone}`} className="w-full py-4 bg-[#FF6B35] hover:bg-[#E85D2E] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#FF6B35]/30 flex items-center justify-center gap-2">
                                        <Phone className="w-5 h-5" />
                                        {car.contactPhone}
                                    </a>
                                    <button
                                        onClick={() => {
                                            const phone = car.contactPhone.replace(/\D/g, '');
                                            const message = `Bonjour, je suis intéressé par votre annonce : ${car.marque} ${car.modele} sur MadjidAuto.`;
                                            window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
                                        }}
                                        className="w-full py-4 bg-white border-2 border-[#1A1A2E] text-[#1A1A2E] hover:bg-[#1A1A2E] hover:text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                        Envoyer un message
                                    </button>
                                </div>
                            </div>

                            {/* Safety Tips */}
                            <div className="bg-[#1A1A2E] rounded-3xl p-6 text-white shadow-lg">
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-[#FF6B35]" />
                                    Sécurité
                                </h3>
                                <ul className="space-y-3 text-sm text-gray-300">
                                    <li>• Ne jamais envoyer d'argent à l'avance</li>
                                    <li>• Rencontrez le vendeur dans un lieu public</li>
                                    <li>• Vérifiez le véhicule avant l'achat</li>
                                </ul>
                            </div>

                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
