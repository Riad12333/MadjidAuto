import Link from "next/link";
import Image from "next/image";
import { MapPin, Gauge, Calendar, Fuel } from "lucide-react";
import type { Car } from "@/lib/data";

interface CarCardProps {
    car: Car;
}

export default function CarCard({ car }: CarCardProps) {
    return (
        <Link
            href={`/occasions/${car.id}`}
            className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all"
        >
            <div className="relative h-48">
                <Image
                    src={car.image}
                    alt={`${car.brand} ${car.model}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {car.isNew && (
                    <span className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
                        NEUVE
                    </span>
                )}
                <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded">
                    {car.date}
                </span>
            </div>

            <div className="p-4">
                <h3 className="font-bold text-gray-900 group-hover:text-[#D32F2F] transition-colors">
                    {car.brand} {car.model}
                </h3>
                <p className="text-xl font-bold text-[#D32F2F] mt-1">{car.price}</p>

                <div className="flex flex-wrap gap-2 mt-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {car.city}
                    </span>
                    <span className="flex items-center gap-1">
                        <Gauge className="w-3 h-3" /> {car.km}
                    </span>
                    <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {car.year}
                    </span>
                    <span className="flex items-center gap-1">
                        <Fuel className="w-3 h-3" /> {car.fuel}
                    </span>
                </div>

                {car.transmission && (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            {car.year}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            {car.transmission}
                        </span>
                    </div>
                )}
            </div>
        </Link>
    );
}
