"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Users, ChevronLeft, Search, Shield, ShieldCheck, Building2,
    Mail, Phone, MapPin, Calendar, MoreVertical, Trash2, Eye
} from "lucide-react";
import ProtectedRoute from "../../components/ProtectedRoute";

interface User {
    _id: string;
    nom: string;
    prenom: string;
    email: string;
    phone: string;
    ville: string;
    role: string;
    createdAt: string;
}

function AdminUsersContent() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            } else {
                console.error('Failed to fetch users');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/users/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                setUsers(users.filter(u => u._id !== id));
            } else {
                alert('Erreur lors de la suppression');
            }
        } catch (error) {
            console.error(error);
            alert('Erreur serveur');
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return (
                    <span className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs">
                        <ShieldCheck className="w-3 h-3" /> Admin
                    </span>
                );
            case 'SHOWROOM':
                return (
                    <span className="flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-xs">
                        <Building2 className="w-3 h-3" /> Showroom
                    </span>
                );
            default:
                return (
                    <span className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs">
                        <Shield className="w-3 h-3" /> Utilisateur
                    </span>
                );
        }
    };

    const filteredUsers = users.filter(user =>
        `${user.nom || ''} ${user.prenom || ''} ${user.email || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
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
                            <h1 className="text-2xl font-bold">Gestion des Utilisateurs</h1>
                            <p className="text-gray-500 text-sm">{users.length} utilisateurs enregistrés</p>
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
                        placeholder="Rechercher par nom ou email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-96 pl-10 pr-4 py-3 bg-[#1E293B] border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FF6B35]"
                    />
                </div>

                {/* Users Grid */}
                {loading ? (
                    <div className="text-center py-12 text-gray-500">Chargement...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredUsers.map((user, index) => (
                            <motion.div
                                key={user._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-[#1E293B] rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-colors"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#F7931E] flex items-center justify-center text-xl font-bold uppercase">
                                            {user.nom?.charAt(0) || 'U'}
                                        </div>
                                        <div>
                                            <h3 className="font-bold">{user.nom} {user.prenom}</h3>
                                            {getRoleBadge(user.role)}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Mail className="w-4 h-4" />
                                        {user.email}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Phone className="w-4 h-4" />
                                        {user.phone || 'Non renseigné'}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <MapPin className="w-4 h-4" />
                                        {user.ville || 'Non renseignée'}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Calendar className="w-4 h-4" />
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : '-'}
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                                    {user.role !== 'ADMIN' && (
                                        <button
                                            onClick={() => deleteUser(user._id)}
                                            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Supprimer
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default function AdminUsers() {
    return (
        <ProtectedRoute requiredRole="ADMIN">
            <AdminUsersContent />
        </ProtectedRoute>
    );
}
