"use client";

import { useState } from "react";
import HeaderModern from "../components/layout/HeaderModern";
import Footer from "../components/layout/Footer";
import Link from "next/link";
import { User, Lock, Mail, ArrowRight, Phone, Store } from "lucide-react";
import { API_URL } from "@/lib/config";

export default function InscriptionPage() {
    const [role, setRole] = useState<'USER' | 'SHOWROOM'>('USER');

    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <HeaderModern />

            <section className="pt-32 pb-24 px-6">
                <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                    <div className="p-8 md:p-12">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-[#1A1A2E] mb-2">Créer un compte</h1>
                            <p className="text-gray-500">Choisissez votre type de compte</p>
                        </div>

                        {/* Account Type Selector */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <button
                                onClick={() => setRole('USER')}
                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${role === 'USER'
                                    ? 'border-[#FF6B35] bg-orange-50 text-[#FF6B35]'
                                    : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'
                                    }`}
                                type="button"
                            >
                                <User className="w-8 h-8" />
                                <span className="font-bold text-sm">Particulier</span>
                            </button>
                            <button
                                onClick={() => setRole('SHOWROOM')}
                                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${role === 'SHOWROOM'
                                    ? 'border-[#FF6B35] bg-orange-50 text-[#FF6B35]'
                                    : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'
                                    }`}
                                type="button"
                            >
                                <Store className="w-8 h-8" />
                                <span className="font-bold text-sm">Showroom</span>
                            </button>
                        </div>

                        <form className="space-y-5" onSubmit={async (e) => {
                            e.preventDefault();
                            const form = e.target as any;
                            const formData = {
                                prenom: form.prenom.value,
                                nom: form.nom.value,
                                email: form.email.value,
                                phone: form.phone.value,
                                password: form.password.value,
                                ville: 'Alger',
                                role: role
                            };

                            try {
                                const res = await fetch(`${API_URL}/api/users/register`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(formData)
                                });
                                const data = await res.json();

                                if (res.ok) {
                                    localStorage.setItem('token', data.token);
                                    localStorage.setItem('user', JSON.stringify(data));
                                    // Redirect based on role
                                    window.location.href = role === 'SHOWROOM' ? '/dashboard' : '/';
                                } else {
                                    alert(data.msg || data.message || 'Erreur lors de l\'inscription');
                                }
                            } catch (err) {
                                alert('Erreur: Impossible de contacter le serveur');
                            }
                        }}>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Prénom</label>
                                    <input
                                        name="prenom"
                                        type="text"
                                        placeholder="Karim"
                                        required
                                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Nom</label>
                                    <input
                                        name="nom"
                                        type="text"
                                        placeholder="Benzema"
                                        required
                                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder={role === 'SHOWROOM' ? "contact@monshowroom.com" : "votre@email.com"}
                                        required
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Téléphone</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        name="phone"
                                        type="tel"
                                        placeholder="05 55..."
                                        required
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Mot de passe</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 transition-all"
                                    />
                                </div>
                            </div>

                            <button className="w-full py-4 bg-[#FF6B35] hover:bg-[#E85D2E] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#FF6B35]/30 flex items-center justify-center gap-2 group mt-4">
                                {role === 'SHOWROOM' ? 'Créer mon Showroom' : 'S\'inscrire gratuitement'}
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>

                        <div className="mt-8 text-center text-sm text-gray-500">
                            Déjà un compte ?{" "}
                            <Link href="/connexion" className="text-[#FF6B35] font-bold hover:underline">
                                Se connecter
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
