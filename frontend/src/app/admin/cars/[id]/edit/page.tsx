"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import CarForm from "../../../../components/shared/CarForm";

export default function EditCarPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [car, setCar] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/cars/${id}`);
                if (!res.ok) throw new Error("Véhicule introuvable");
                const data = await res.json();
                setCar(data);
            } catch (err) {
                console.error(err);
                alert("Impossible de charger le véhicule");
                router.push('/admin/cars');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchCar();
    }, [id, router]);

    if (loading) {
        return <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-white">Chargement...</div>;
    }

    return (
        <div className="min-h-screen bg-[#0F172A] text-white">
            <header className="sticky top-0 z-40 bg-[#0F172A]/80 backdrop-blur-xl border-b border-white/10 px-6 py-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/cars" className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10">
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Modifier Véhicule</h1>
                        <p className="text-gray-500 text-sm">{car.marque} {car.modele}</p>
                    </div>
                </div>
            </header>

            <main className="p-6 max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl p-6 text-gray-900">
                    <CarForm
                        initialData={car}
                        onSuccess={() => router.push('/admin/cars')}
                        currentRole="ADMIN"
                    />
                </div>
            </main>
        </div>
    );
}
