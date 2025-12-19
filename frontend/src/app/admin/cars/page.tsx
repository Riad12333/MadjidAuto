"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Car, ChevronLeft, Plus, Search, Filter, Trash2, Edit, Eye,
    MoreVertical, CheckCircle, XCircle, Clock
} from "lucide-react";
import ProtectedRoute from "../../components/ProtectedRoute";
import { API_URL } from "@/lib/config";

interface CarItem {
    _id: string;
    marque: string;
    modele: string;
    prix: number;
    annee: number;
    km: number;
    ville: string;
    status: string;
    isNew: boolean;
    images: string[];
    createdAt: string;
}

function AdminCarsContent() {
    const [cars, setCars] = useState<CarItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        try {
            const res = await fetch(`${API_URL}/api/cars?limit=100`);
            const data = await res.json();
            setCars(data.cars || []);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteCar = async (id: string) => {
        if (!confirm('Supprimer ce véhicule ?')) return;

        const token = localStorage.getItem('token');
        try {
            await fetch(`${API_URL}/api/cars/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setCars(cars.filter(car => car._id !== id));
        } catch (error) {
            alert('Erreur lors de la suppression');
        }
    };

    const filteredCars = cars.filter(car => {
        const matchesSearch = `${car.marque} ${car.modele}`.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || car.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'DISPONIBLE':
                return <span className="flex items-center gap-1 text-emerald-400 text-xs"><CheckCircle className="w-3 h-3" /> Disponible</span>;
            case 'VENDU':
                return <span className="flex items-center gap-1 text-red-400 text-xs"><XCircle className="w-3 h-3" /> Vendu</span>;
            case 'RESERVE':
                return <span className="flex items-center gap-1 text-yellow-400 text-xs"><Clock className="w-3 h-3" /> Réservé</span>;
            default:
                return <span className="text-gray-400 text-xs">{status}</span>;
        }
    };

    return (
        <div className="min-h-screen bg-[#0F172A] text-white">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-[#0F172A]/80 backdrop-blur-xl border-b border-white/10 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10">
                            <ChevronLeft className="w-6 h-6" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">Gestion des Véhicules</h1>
                            <p className="text-gray-500 text-sm">{cars.length} véhicules au total</p>
                        </div>
                    </div>
                    <Link
                        href="/admin/cars/new"
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF6B35] to-[#F7931E] rounded-xl font-medium hover:opacity-90 transition-opacity"
                    >
                        <Plus className="w-5 h-5" />
                        Ajouter
                    </Link>
                </div>
            </header>

            <main className="p-6">
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Rechercher par marque ou modèle..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-[#1E293B] border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FF6B35]"
                        />
                    </div>
                    <div className="flex gap-2">
                        {['all', 'DISPONIBLE', 'VENDU', 'RESERVE'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === status
                                    ? 'bg-[#FF6B35] text-white'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                {status === 'all' ? 'Tous' : status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="bg-[#1E293B] rounded-2xl border border-white/10 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Véhicule</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Année</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Km</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Ville</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                            Chargement...
                                        </td>
                                    </tr>
                                ) : filteredCars.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                            Aucun véhicule trouvé
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCars.map((car, index) => (
                                        <motion.tr
                                            key={car._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="hover:bg-white/5 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-10 rounded-lg bg-gray-700 overflow-hidden">
                                                        <img
                                                            src={car.images?.[0] || 'https://via.placeholder.com/100'}
                                                            alt={car.modele}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{car.marque} {car.modele}</p>
                                                        {car.isNew && (
                                                            <span className="text-xs text-[#FF6B35]">Neuf</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-[#FF6B35]">
                                                {car.prix?.toLocaleString()} DA
                                            </td>
                                            <td className="px-6 py-4 text-gray-400">{car.annee}</td>
                                            <td className="px-6 py-4 text-gray-400">{car.km?.toLocaleString()} km</td>
                                            <td className="px-6 py-4 text-gray-400">{car.ville}</td>
                                            <td className="px-6 py-4">{getStatusBadge(car.status || 'DISPONIBLE')}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/occasions/${car._id}`}
                                                        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                    <Link
                                                        href={`/admin/cars/${car._id}/edit`}
                                                        className="p-2 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-blue-500/10"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => deleteCar(car._id)}
                                                        className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function AdminCars() {
    return (
        <ProtectedRoute requiredRole="ADMIN">
            <AdminCarsContent />
        </ProtectedRoute>
    );
}
