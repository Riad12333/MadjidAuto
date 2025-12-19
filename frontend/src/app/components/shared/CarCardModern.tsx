"use client";
import { API_URL } from "@/lib/config";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Gauge, Calendar, Fuel, Heart, ArrowRight } from "lucide-react";
import type { Car } from "@/lib/data";

interface CarCardModernProps {
    car: Car;
}

// Format price in DA
const formatPrice = (price: number | string | undefined): string => {
    if (!price) return "Prix sur demande";
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('fr-DZ').format(numPrice) + ' DA';
};

// Format km
const formatKm = (km: number | string | undefined): string => {
    if (!km) return "N/A";
    const numKm = typeof km === 'string' ? parseFloat(km) : km;
    return new Intl.NumberFormat('fr-DZ').format(numKm) + ' km';
};

export default function CarCardModern({ car }: CarCardModernProps) {
    // Get image URL - handle both old and new data structure
    const rawImageUrl = car.image || (car.images && car.images.length > 0 ? car.images[0] : null);

    // Fix function for local images
    const getImageUrl = (url: string | null) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        // Normalize backslashes to forward slashes for Windows paths
        const normalizedUrl = url.replace(/\\/g, '/');
        // Ensure leading slash if not present
        const path = normalizedUrl.startsWith('/') ? normalizedUrl : `/${normalizedUrl}`;
        return `${API_URL}${path}`;
    };

    const imageUrl = getImageUrl(rawImageUrl);
    const fallbackImage = "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
        >
            {/* Image Container */}
            <div className="relative h-64 overflow-hidden">
                <img
                    src={imageUrl || fallbackImage}
                    alt={`${car.marque || car.brand} ${car.modele || car.model}`}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {car.isNew && (
                        <span className="px-3 py-1 bg-[#FF6B35] text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-md">
                            NOUVEAU
                        </span>
                    )}
                </div>

                {/* Favorite Button */}
                <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white transition-colors group/btn">
                    <Heart className="w-5 h-5 text-white group-hover/btn:text-[#FF6B35] transition-colors" />
                </button>

                {/* Price Tag */}
                <div className="absolute bottom-4 left-4">
                    <p className="text-white font-bold text-xl drop-shadow-md">
                        {formatPrice(car.prix || car.price)}
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#FF6B35] transition-colors">
                        {car.marque || car.brand} <span className="font-normal">{car.modele || car.model}</span>
                    </h3>
                    <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                        <MapPin className="w-3 h-3" />
                        {car.ville || car.city || "Algérie"}
                    </div>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                    <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-xl">
                        <Gauge className="w-4 h-4 text-[#FF6B35] mb-1" />
                        <span className="text-xs font-medium text-gray-600">{formatKm(car.km)}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-xl">
                        <Calendar className="w-4 h-4 text-[#FF6B35] mb-1" />
                        <span className="text-xs font-medium text-gray-600">{car.annee || car.year}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-xl">
                        <Fuel className="w-4 h-4 text-[#FF6B35] mb-1" />
                        <span className="text-xs font-medium text-gray-600">{car.carburant || car.fuel || "---"}</span>
                    </div>
                </div>

                {/* Action */}
                <Link
                    href={`/occasions/${car._id || car.id}`}
                    className="flex items-center justify-center w-full py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-[#1A1A2E] hover:text-white hover:border-[#1A1A2E] transition-all group/link"
                >
                    Voir détails
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                </Link>
            </div>
        </motion.div>
    );
}
