"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import HeaderModern from "../../components/layout/HeaderModern";
import Footer from "../../components/layout/Footer";
import { MapPin, Phone, Mail, Clock, ShieldCheck, Car } from "lucide-react";

export default function ShowroomDetailPage() {
    const params = useParams();
    const [showroom, setShowroom] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'all' | 'new' | 'used'>('all');

    useEffect(() => {
        if (params.id) {
            fetch(`http://localhost:5000/api/showrooms/${params.id}`)
                .then(res => res.json())
                .then(data => setShowroom(data))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [params.id]);

    if (loading) return <div className="min-h-screen pt-32 text-center">Chargement...</div>;
    if (!showroom) return <div className="min-h-screen pt-32 text-center">Showroom introuvable</div>;

    const cars = showroom.cars || [];
    const newCars = cars.filter((c: any) => c.isNew);
    const usedCars = cars.filter((c: any) => !c.isNew);

    const filteredCars = activeTab === 'all' ? cars : (activeTab === 'new' ? newCars : usedCars);

    const isEmbedMap = showroom.location?.googleMapLink?.includes('embed');

    const getImageUrl = (url: string) => {
        if (!url) return "";
        if (url.startsWith('http')) return url;
        const normalizedUrl = url.replace(/\\/g, '/');
        const path = normalizedUrl.startsWith('/') ? normalizedUrl : `/${normalizedUrl}`;
        return `http://localhost:5000${path}`;
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <HeaderModern />

            {/* Cover / Header */}
            <div className="relative bg-[#1A1A2E] text-white pt-32 pb-12 overflow-hidden">
                {showroom.coverImage && (
                    <div className="absolute inset-0 z-0">
                        <img
                            src={getImageUrl(showroom.coverImage)}
                            alt="Couverture"
                            className="w-full h-full object-cover opacity-60"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E] via-[#1A1A2E]/80 to-transparent"></div>
                    </div>
                )}
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-32 h-32 bg-white rounded-2xl p-2 shrink-0">
                            {showroom.logo ? (
                                <img src={getImageUrl(showroom.logo)} alt={showroom.nom} className="w-full h-full object-contain" />
                            ) : (
                                <div className="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                                    <ShieldCheck className="w-12 h-12" />
                                </div>
                            )}
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl font-bold mb-2">{showroom.nom}</h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-gray-300">
                                <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#FF6B35]" /> {showroom.ville}</span>
                                <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#FF6B35]" /> {showroom.telephone}</span>
                                {showroom.email && <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#FF6B35]" /> {showroom.email}</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Sidebar Info */}
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-lg mb-4">À propos</h3>
                        <p className="text-gray-600 leading-relaxed mb-6">
                            {showroom.description || "Aucune description disponible pour ce concessionnaire."}
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-[#FF6B35] shrink-0 mt-1" />
                                <div>
                                    <p className="font-bold text-gray-900">Adresse</p>
                                    <p className="text-sm text-gray-600">{showroom.adresse || showroom.ville}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Clock className="w-5 h-5 text-[#FF6B35] shrink-0 mt-1" />
                                <div>
                                    <p className="font-bold text-gray-900">Horaires</p>
                                    <p className="text-sm text-gray-600 whitespace-pre-line">{showroom.horaires || "Non spécifié"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map */}
                    {showroom.location?.googleMapLink && (
                        <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 h-64 overflow-hidden">
                            {isEmbedMap ? (
                                <iframe
                                    src={showroom.location.googleMapLink}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                ></iframe>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center bg-gray-50 rounded-xl p-4 text-center">
                                    <MapPin className="w-10 h-10 text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-500 mb-4">Emplacement sur la carte</p>
                                    <a
                                        href={showroom.location.googleMapLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-[#FF6B35] text-white rounded-lg font-bold text-sm"
                                    >
                                        Voir sur Google Maps
                                    </a>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Main Content : Stock */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Car className="w-6 h-6 text-[#FF6B35]" />
                            Notre Stock
                        </h2>

                        <div className="flex bg-white p-1 rounded-xl border border-gray-200">
                            <button
                                onClick={() => setActiveTab('all')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'all' ? 'bg-[#1A1A2E] text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                Tout
                            </button>
                            <button
                                onClick={() => setActiveTab('new')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'new' ? 'bg-[#FF6B35] text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                Neuf
                            </button>
                            <button
                                onClick={() => setActiveTab('used')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'used' ? 'bg-[#FF6B35] text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                Occasion
                            </button>
                        </div>
                    </div>

                    {filteredCars.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredCars.map((car: any) => (
                                <div key={car._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                                    <div className="h-48 bg-gray-200 relative">
                                        {car.images?.[0] ? (
                                            <img src={getImageUrl(car.images[0])} alt={car.modele} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <Car className="w-10 h-10" />
                                            </div>
                                        )}
                                        <div className="absolute top-2 left-2 bg-[#1A1A2E] text-white text-xs font-bold px-2 py-1 rounded">
                                            {car.annee}
                                        </div>
                                        <div className={`absolute top-2 right-2 text-white text-xs font-bold px-2 py-1 rounded ${car.isNew ? 'bg-green-500' : 'bg-blue-500'}`}>
                                            {car.isNew ? 'NEUF' : 'OCCASION'}
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-lg mb-1">{car.marque} {car.modele}</h3>
                                        <p className="text-gray-500 text-sm mb-3">{car.version}</p>
                                        <p className="text-[#FF6B35] font-bold text-xl">{car.prix.toLocaleString()} DA</p>

                                        <Link href={`/occasions/${car._id}`} className="mt-4 block w-full py-2 bg-gray-50 text-center font-bold text-sm rounded-lg hover:bg-gray-100 text-gray-700">
                                            Voir Détails
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl p-12 text-center border-dashed border-2 border-gray-200">
                            <p className="text-gray-500">Aucun véhicule disponible dans cette catégorie.</p>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}
