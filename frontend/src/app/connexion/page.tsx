"use client";

import HeaderModern from "../components/layout/HeaderModern";
import Footer from "../components/layout/Footer";
import Link from "next/link";
import { User, Lock, ArrowRight } from "lucide-react";

export default function ConnexionPage() {
    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <HeaderModern />

            <section className="pt-32 pb-24 px-6">
                <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                    <div className="p-8 md:p-12">
                        <div className="text-center mb-10">
                            <h1 className="text-3xl font-bold text-[#1A1A2E] mb-2">Bon retour !</h1>
                            <p className="text-gray-500">Connectez-vous à votre compte MadjidAuto</p>
                        </div>

                        <form className="space-y-6" onSubmit={async (e) => {
                            e.preventDefault();
                            const email = (e.target as any).email.value;
                            const password = (e.target as any).password.value;

                            try {
                                const res = await fetch('http://localhost:5000/api/users/login', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ email, password })
                                });
                                const data = await res.json();

                                if (res.ok) {
                                    localStorage.setItem('token', data.token);
                                    localStorage.setItem('user', JSON.stringify(data));

                                    // Rediriger selon le rôle
                                    if (data.role === 'ADMIN') {
                                        window.location.href = '/admin';
                                    } else if (data.role === 'SHOWROOM') {
                                        window.location.href = '/dashboard';
                                    } else {
                                        window.location.href = '/';
                                    }
                                } else {
                                    alert(data.message || data.msg || 'Erreur de connexion');
                                }
                            } catch (err) {
                                alert('Erreur: Impossible de contacter le serveur');
                            }
                        }}>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="votre@email.com"
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

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35]" />
                                    <span className="text-gray-600">Se souvenir de moi</span>
                                </label>
                                <Link href="#" className="text-[#FF6B35] font-bold hover:underline">
                                    Mot de passe oublié ?
                                </Link>
                            </div>

                            <button className="w-full py-4 bg-[#FF6B35] hover:bg-[#E85D2E] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#FF6B35]/30 flex items-center justify-center gap-2 group">
                                Se connecter
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>

                        <div className="mt-8 text-center text-sm text-gray-500">
                            Pas encore de compte ?{" "}
                            <Link href="/inscription" className="text-[#FF6B35] font-bold hover:underline">
                                Créer un compte gratuit
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
