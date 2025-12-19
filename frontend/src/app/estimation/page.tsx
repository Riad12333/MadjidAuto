"use client";

import HeaderModern from "../components/layout/HeaderModern";
import Footer from "../components/layout/Footer";
import PageHeader from "../components/shared/PageHeader";
import { Calculator, CheckCircle, ArrowRight, Car } from "lucide-react";
import Link from "next/link";

export default function EstimationPage() {
    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <HeaderModern />

            <PageHeader
                icon={Calculator}
                badge="Outil Gratuit"
                title="Estimez votre"
                highlight="Véhicule"
                description="Obtenez une estimation précise de la valeur de votre voiture sur le marché algérien en quelques clics."
            />

            <section className="py-12 max-w-5xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Formulaire */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                            <div className="p-8">
                                <h2 className="text-2xl font-bold text-[#1A1A2E] mb-6">Détails du véhicule</h2>

                                <form className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Marque</label>
                                            <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B35]">
                                                <option>Sélectionner...</option>
                                                <option>Renault</option>
                                                <option>Peugeot</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Modèle</label>
                                            <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B35]">
                                                <option>Sélectionner...</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Année</label>
                                            <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B35]">
                                                <option>2024</option>
                                                <option>2023</option>
                                                <option>2022</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Carburant</label>
                                            <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B35]">
                                                <option>Essence</option>
                                                <option>Diesel</option>
                                                <option>GPL</option>
                                                <option>Hybride</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Kilométrage</label>
                                            <input type="number" placeholder="Ex: 50000" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B35]" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Boîte de vitesse</label>
                                            <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B35]">
                                                <option>Manuelle</option>
                                                <option>Automatique</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-gray-100">
                                        <button className="w-full py-4 bg-[#FF6B35] hover:bg-[#E85D2E] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#FF6B35]/30 flex items-center justify-center gap-2 text-lg">
                                            Calculer l'estimation
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-[#1A1A2E] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6B35] rounded-full blur-3xl opacity-20" />

                            <h3 className="text-xl font-bold mb-6">Pourquoi utiliser notre outil ?</h3>
                            <ul className="space-y-4">
                                {[
                                    "Basé sur les prix réels du marché",
                                    "Mise à jour quotidienne",
                                    "Prend en compte les options",
                                    "100% Gratuit et sans engagement"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-[#FF6B35] mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-300 text-sm">{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-8 pt-6 border-t border-white/10">
                                <p className="text-sm text-gray-400 mb-4">Vous souhaitez vendre votre voiture ?</p>
                                <Link href="/publier-annonce" className="block w-full py-3 bg-white text-[#1A1A2E] text-center font-bold rounded-xl hover:bg-gray-100 transition-colors">
                                    Publier une annonce
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            <Footer />
        </div>
    );
}
