"use client";

import HeaderModern from "../../components/layout/HeaderModern";
import Footer from "../../components/layout/Footer";
import PageHeader from "../../components/shared/PageHeader";
import CarCardModern from "../../components/shared/CarCardModern";
import { Car, ArrowLeft } from "lucide-react";
import { CARS } from "@/lib/data";
import { use } from "react";
import Link from "next/link";

export default function BrandPage({ params }: { params: Promise<{ brand: string }> }) {
    const { brand } = use(params);
    const brandName = decodeURIComponent(brand).toUpperCase();

    // Filtrer les voitures par marque (simulation)
    // Dans un vrai cas, on filtrerait CARS.filter(c => c.brand.toLowerCase() === brand.toLowerCase())
    // Ici on affiche tout pour la démo si pas de match exact, ou on filtre si possible
    const filteredCars = CARS.filter(c => c.brand && c.brand.toUpperCase() === brandName);
    const displayCars = filteredCars.length > 0 ? filteredCars : CARS.slice(0, 4); // Fallback pour la démo

    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <HeaderModern />

            <PageHeader
                icon={Car}
                badge="Marque"
                title="Véhicules"
                highlight={brandName}
                description={`Découvrez toutes les annonces de voitures ${brandName} neuves et d'occasion disponibles en Algérie.`}
            />

            <section className="py-12 max-w-7xl mx-auto px-6">
                <Link href="/occasions" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#FF6B35] transition-colors mb-8">
                    <ArrowLeft className="w-4 h-4" /> Retour à toutes les marques
                </Link>

                {filteredCars.length === 0 && (
                    <div className="mb-8 p-4 bg-yellow-50 text-yellow-800 rounded-xl border border-yellow-200">
                        Note : Aucune voiture trouvée pour cette marque exacte dans les données de démo. Affichage de suggestions :
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayCars.map((car) => (
                        <CarCardModern key={car.id} car={car} />
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
}
