import Link from "next/link";
import Image from "next/image";
import { MapPin, Car, Phone, Star } from "lucide-react";
import type { Showroom } from "@/lib/data";

interface ShowroomCardProps {
    showroom: Showroom;
}

export default function ShowroomCard({ showroom }: ShowroomCardProps) {
    return (
        <Link
            href={`/concessionnaires/${showroom.id}`}
            className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all"
        >
            <div className="relative h-48">
                <Image
                    src={showroom.image}
                    alt={showroom.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                {showroom.rating && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white rounded-full">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-bold text-gray-900">{showroom.rating}</span>
                    </div>
                )}

                <div className="absolute bottom-3 left-3 flex items-center gap-1 px-3 py-1 bg-[#D32F2F] text-white rounded-full">
                    <Car className="w-4 h-4" />
                    <span className="text-sm font-bold">{showroom.cars}</span>
                </div>
            </div>

            <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#D32F2F] transition-colors mb-2">
                    {showroom.name}
                </h3>

                {showroom.address && showroom.phone && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <MapPin className="w-4 h-4 text-[#D32F2F]" />
                            {showroom.address}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <Phone className="w-4 h-4 text-[#D32F2F]" />
                            {showroom.phone}
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                        📍 {showroom.city}
                    </span>
                    <span className="text-[#D32F2F] text-sm font-medium group-hover:underline">
                        Voir détails →
                    </span>
                </div>
            </div>
        </Link>
    );
}
