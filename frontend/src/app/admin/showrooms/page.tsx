"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Building2, ChevronLeft, Search, MapPin, Phone, Mail,
    MoreVertical, Trash2, Eye, Car
} from "lucide-react";
import ProtectedRoute from "../../components/ProtectedRoute";

interface Showroom {
    _id: string;
    nom: string;
    ville: string;
    telephone: string;
    email: string;
    logo: string;
    carsCount?: number;
    createdAt: string;
}

function AdminShowroomsContent() {
    const [showrooms, setShowrooms] = useState<Showroom[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchShowrooms();
    }, []);

    const fetchShowrooms = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/showrooms');
            const data = await res.json();
            setShowrooms(data || []);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteShowroom = async (id: string) => {
        if (!confirm('Supprimer ce showroom ? Cette action est irréversible.')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/showrooms/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                setShowrooms(showrooms.filter(s => s._id !== id));
            } else {
                alert('Erreur lors de la suppression');
            }
        } catch (error) {
            console.error(error);
            alert('Erreur serveur');
        }
    };

    const filteredShowrooms = showrooms.filter(s =>
        s.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.ville.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#0F172A] text-white">
            <header className="sticky top-0 z-40 bg-[#0F172A]/80 backdrop-blur-xl border-b border-white/10 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10">
                            <ChevronLeft className="w-6 h-6" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">Gestion des Showrooms</h1>
                            <p className="text-gray-500 text-sm">{showrooms.length} showrooms inscrits</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="p-6">
                {/* Search */}
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Rechercher par nom ou ville..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-96 pl-10 pr-4 py-3 bg-[#1E293B] border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FF6B35]"
                    />
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="text-center py-12 text-gray-500">Chargement...</div>
                ) : filteredShowrooms.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">Aucun showroom trouvé.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredShowrooms.map((showroom, index) => (
                            <motion.div
                                key={showroom._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-[#1E293B] rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-colors"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-xl bg-white p-1 overflow-hidden flex items-center justify-center">
                                            {showroom.logo ? (
                                                <img src={showroom.logo} alt={showroom.nom} className="w-full h-full object-contain" />
                                            ) : (
                                                <Building2 className="w-8 h-8 text-gray-400" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">{showroom.nom}</h3>
                                            <div className="flex items-center gap-1 text-gray-400 text-sm">
                                                <MapPin className="w-3 h-3" />
                                                {showroom.ville}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 text-sm text-gray-300">
                                        <Phone className="w-4 h-4 text-gray-500" />
                                        {showroom.telephone || 'Non renseigné'}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-300">
                                        <Mail className="w-4 h-4 text-gray-500" />
                                        {showroom.email || 'Non renseigné'}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-300">
                                        <Car className="w-4 h-4 text-gray-500" />
                                        {showroom.carsCount || 0} véhicules
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-4 border-t border-white/10">
                                    <Link
                                        href={`/concessionnaires/${showroom._id}`}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm"
                                    >
                                        <Eye className="w-4 h-4" />
                                        Voir
                                    </Link>
                                    <button
                                        onClick={() => deleteShowroom(showroom._id)}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors text-sm"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Supprimer
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default function AdminShowrooms() {
    return (
        <ProtectedRoute requiredRole="ADMIN">
            <AdminShowroomsContent />
        </ProtectedRoute>
    );
}
