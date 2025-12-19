"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import HeaderModern from "../components/layout/HeaderModern";
import Footer from "../components/layout/Footer";
import PageHeader from "../components/shared/PageHeader";
import ProtectedRoute from "../components/ProtectedRoute";
import { Car, Camera, CheckCircle, AlertCircle } from "lucide-react";


import CarForm from "../components/shared/CarForm";

export default function PublierAnnoncePage() {
    return (
        <ProtectedRoute>
            <PublierPageContent />
        </ProtectedRoute>
    );
}

function PublierPageContent() {
    const router = useRouter();

    const handleSuccess = () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.role === 'SHOWROOM') {
            router.push('/dashboard');
        } else {
            router.push('/profil');
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <HeaderModern />

            <PageHeader
                icon={Car}
                badge="Vente Rapide"
                title="Publier une"
                highlight="Annonce"
                description="Vendez votre voiture rapidement. Touchez des milliers d'acheteurs potentiels."
            />

            <section className="py-12 max-w-4xl mx-auto px-6">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-8 md:p-12">
                        <CarForm onSuccess={handleSuccess} />
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}


