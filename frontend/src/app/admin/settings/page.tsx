"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, User, Mail, Phone, MapPin, Save, Shield } from "lucide-react";
import ProtectedRoute from "../../components/ProtectedRoute";
import { API_URL } from "@/lib/config";

function AdminSettingsContent() {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        nom: '',
        prenom: '',
        email: '',
        phone: '',
        ville: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch(`${API_URL}/api/users/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) {
                    setForm({
                        nom: data.nom || '',
                        prenom: data.prenom || '',
                        email: data.email || '',
                        phone: data.phone || '',
                        ville: data.ville || ''
                    });
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchProfile();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/api/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });

            if (res.ok) {
                const updatedUser = await res.json();
                localStorage.setItem('user', JSON.stringify(updatedUser)); // Update local storage
                alert('Profil mis à jour avec succès');
            } else {
                alert('Erreur lors de la mise à jour');
            }
        } catch (error) {
            alert('Erreur serveur');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-[#0F172A] text-white">
            <header className="sticky top-0 z-40 bg-[#0F172A]/80 backdrop-blur-xl border-b border-white/10 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10">
                            <ChevronLeft className="w-6 h-6" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">Paramètres</h1>
                            <p className="text-gray-500 text-sm">Gérer votre profil administrateur</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="p-6 max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#1E293B] rounded-2xl border border-white/10 p-8"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#F7931E] flex items-center justify-center text-2xl font-bold">
                            {form.nom.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                {form.prenom} {form.nom}
                                <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-lg flex items-center gap-1">
                                    <Shield className="w-3 h-3" /> Admin
                                </span>
                            </h2>
                            <p className="text-gray-500">{form.email}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Nom</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        name="nom"
                                        value={form.nom}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#FF6B35]"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Prénom</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        name="prenom"
                                        value={form.prenom}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#FF6B35]"
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        type="email"
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#FF6B35]"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Téléphone</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#FF6B35]"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Ville</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        name="ville"
                                        value={form.ville}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#FF6B35]"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/10 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-[#F7931E] rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 text-white"
                            >
                                <Save className="w-5 h-5" />
                                {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </main>
        </div>
    );
}

export default function AdminSettings() {
    return (
        <ProtectedRoute requiredRole="ADMIN">
            <AdminSettingsContent />
        </ProtectedRoute>
    );
}
