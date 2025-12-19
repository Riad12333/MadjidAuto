"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    LayoutDashboard, Car, Users, Newspaper, Building2, Settings,
    LogOut, TrendingUp, Eye, Heart, Clock, ChevronRight, Plus,
    Search, Bell, Menu, X, BarChart3, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import ProtectedRoute from "../components/ProtectedRoute";
import { API_URL } from "@/lib/config";

interface Stats {
    totalCars: number;
    totalUsers: number;
    totalNews: number;
    totalShowrooms: number;
    totalViews: number;
    recentCars: any[];
}

function AdminDashboardContent() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Récupérer les infos utilisateur
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }

        // Fetch stats
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers: any = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const [carsRes, newsRes, showroomsRes, usersRes] = await Promise.all([
                fetch(`${API_URL}/api/cars?limit=100`),
                fetch(`${API_URL}/api/news`),
                fetch(`${API_URL}/api/showrooms`),
                fetch(`${API_URL}/api/users`, { headers })
            ]);

            const carsData = await carsRes.json();
            const newsData = await newsRes.json();
            const showroomsData = await showroomsRes.json();
            const usersData = usersRes.ok ? await usersRes.json() : [];

            setStats({
                totalCars: carsData.total || carsData.cars?.length || 0,
                totalUsers: Array.isArray(usersData) ? usersData.length : 0,
                totalNews: newsData.total || newsData.news?.length || 0,
                totalShowrooms: showroomsData.length || 0,
                totalViews: Math.floor(Math.random() * 50000) + 10000,
                recentCars: carsData.cars?.slice(0, 5) || []
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/admin", active: true },
        { icon: Car, label: "Véhicules", href: "/admin/cars" },
        { icon: Users, label: "Utilisateurs", href: "/admin/users" },
        { icon: Building2, label: "Showrooms", href: "/admin/showrooms" },
        { icon: Newspaper, label: "Actualités", href: "/admin/news" },
        { icon: Settings, label: "Paramètres", href: "/admin/settings" },
    ];

    const statsCards = [
        {
            label: "Véhicules",
            value: stats?.totalCars || 0,
            icon: Car,
            change: "+12%",
            positive: true,
            color: "from-blue-500 to-blue-600"
        },
        {
            label: "Utilisateurs",
            value: stats?.totalUsers || 0,
            icon: Users,
            change: "+8%",
            positive: true,
            color: "from-emerald-500 to-emerald-600"
        },
        {
            label: "Showrooms",
            value: stats?.totalShowrooms || 0,
            icon: Building2,
            change: "+3%",
            positive: true,
            color: "from-purple-500 to-purple-600"
        },
        {
            label: "Vues totales",
            value: stats?.totalViews?.toLocaleString() || 0,
            icon: Eye,
            change: "+24%",
            positive: true,
            color: "from-orange-500 to-orange-600"
        },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF6B35]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0F172A] flex">
            {/* Sidebar */}
            <motion.aside
                initial={{ x: -300 }}
                animate={{ x: sidebarOpen ? 0 : -300 }}
                className={`fixed lg:relative z-50 h-screen w-72 bg-[#1E293B] border-r border-white/10 flex flex-col`}
            >
                {/* Logo */}
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#F7931E] flex items-center justify-center">
                            <Car className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-white font-bold text-lg">MadjidAuto</h1>
                            <p className="text-gray-500 text-xs">Admin Panel</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${item.active
                                ? 'bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white shadow-lg shadow-[#FF6B35]/25'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* User Card */}
                <div className="p-4 border-t border-white/10">
                    <div className="bg-white/5 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#F7931E] flex items-center justify-center text-white font-bold">
                                {user?.nom?.charAt(0) || 'A'}
                            </div>
                            <div>
                                <p className="text-white font-medium text-sm">{user?.nom} {user?.prenom}</p>
                                <p className="text-gray-500 text-xs">{user?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm">Déconnexion</span>
                        </button>
                    </div>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {/* Header */}
                <header className="sticky top-0 z-40 bg-[#0F172A]/80 backdrop-blur-xl border-b border-white/10 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                                <p className="text-gray-500 text-sm">Bienvenue, {user?.prenom} 👋</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="relative hidden md:block">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Rechercher..."
                                    className="w-64 pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FF6B35]"
                                />
                            </div>
                            <button className="relative p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF6B35] rounded-full"></span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {statsCards.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative overflow-hidden bg-[#1E293B] rounded-2xl p-6 border border-white/10"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                        <stat.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className={`flex items-center gap-1 text-sm ${stat.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {stat.positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                        {stat.change}
                                    </div>
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                                <p className="text-gray-500">{stat.label}</p>

                                {/* Decorative gradient */}
                                <div className={`absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-20 rounded-full blur-2xl`}></div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Recent Cars */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="lg:col-span-2 bg-[#1E293B] rounded-2xl border border-white/10 overflow-hidden"
                        >
                            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-white">Derniers Véhicules</h2>
                                <Link href="/admin/cars" className="text-[#FF6B35] text-sm flex items-center gap-1 hover:underline">
                                    Voir tout <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                            <div className="divide-y divide-white/5">
                                {stats?.recentCars?.map((car: any, index: number) => (
                                    <div key={index} className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors">
                                        <div className="w-16 h-12 rounded-lg bg-gray-700 overflow-hidden">
                                            <img
                                                src={car.images?.[0] || 'https://via.placeholder.com/100'}
                                                alt={car.modele}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-white font-medium">{car.marque} {car.modele}</h3>
                                            <p className="text-gray-500 text-sm">{car.ville} • {car.annee}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[#FF6B35] font-bold">{car.prix?.toLocaleString()} DA</p>
                                            <p className="text-gray-500 text-xs">{car.isNew ? 'Neuf' : 'Occasion'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Quick Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-[#1E293B] rounded-2xl border border-white/10 p-6"
                        >
                            <h2 className="text-lg font-bold text-white mb-6">Actions Rapides</h2>
                            <div className="space-y-3">
                                <Link
                                    href="/admin/cars/new"
                                    className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-[#FF6B35]/20 to-transparent border border-[#FF6B35]/30 text-white hover:border-[#FF6B35] transition-all group"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-[#FF6B35] flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Plus className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Ajouter Véhicule</p>
                                        <p className="text-gray-500 text-xs">Publier une nouvelle annonce</p>
                                    </div>
                                </Link>

                                <Link
                                    href="/admin/news/new"
                                    className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 text-white hover:border-white/30 transition-all group"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Newspaper className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Nouvel Article</p>
                                        <p className="text-gray-500 text-xs">Publier une actualité</p>
                                    </div>
                                </Link>

                                <Link
                                    href="/admin/users"
                                    className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 text-white hover:border-white/30 transition-all group"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Gérer Utilisateurs</p>
                                        <p className="text-gray-500 text-xs">Voir tous les comptes</p>
                                    </div>
                                </Link>
                            </div>

                            {/* Performance Chart Placeholder */}
                            <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-white font-medium">Performance</p>
                                    <BarChart3 className="w-5 h-5 text-gray-500" />
                                </div>
                                <div className="flex items-end gap-1 h-24">
                                    {[40, 70, 45, 55, 80, 65, 90, 75, 60, 85, 70, 95].map((height, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ height: 0 }}
                                            animate={{ height: `${height}%` }}
                                            transition={{ delay: 0.5 + i * 0.05 }}
                                            className="flex-1 bg-gradient-to-t from-[#FF6B35] to-[#F7931E] rounded-sm opacity-80"
                                        />
                                    ))}
                                </div>
                                <div className="flex justify-between mt-2">
                                    <span className="text-gray-500 text-xs">Jan</span>
                                    <span className="text-gray-500 text-xs">Déc</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Activity & News */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Recent Activity */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="bg-[#1E293B] rounded-2xl border border-white/10 p-6"
                        >
                            <h2 className="text-lg font-bold text-white mb-6">Activité Récente</h2>
                            <div className="space-y-4">
                                {[
                                    { action: "Nouvelle inscription", user: "Mohamed A.", time: "Il y a 2 min", icon: Users, color: "bg-emerald-500" },
                                    { action: "Véhicule ajouté", user: "Showroom Renault", time: "Il y a 15 min", icon: Car, color: "bg-blue-500" },
                                    { action: "Article publié", user: "Admin", time: "Il y a 1h", icon: Newspaper, color: "bg-purple-500" },
                                    { action: "Nouveau showroom", user: "Toyota Oran", time: "Il y a 2h", icon: Building2, color: "bg-orange-500" },
                                ].map((activity, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full ${activity.color} flex items-center justify-center`}>
                                            <activity.icon className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-white text-sm">{activity.action}</p>
                                            <p className="text-gray-500 text-xs">{activity.user}</p>
                                        </div>
                                        <p className="text-gray-500 text-xs">{activity.time}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Top Brands */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="bg-[#1E293B] rounded-2xl border border-white/10 p-6"
                        >
                            <h2 className="text-lg font-bold text-white mb-6">Top Marques</h2>
                            <div className="space-y-4">
                                {[
                                    { name: "Renault", count: 24, percentage: 85 },
                                    { name: "Hyundai", count: 18, percentage: 70 },
                                    { name: "Peugeot", count: 15, percentage: 60 },
                                    { name: "Kia", count: 12, percentage: 50 },
                                    { name: "Volkswagen", count: 10, percentage: 40 },
                                ].map((brand, index) => (
                                    <div key={index}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-white">{brand.name}</span>
                                            <span className="text-gray-500 text-sm">{brand.count} véhicules</span>
                                        </div>
                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${brand.percentage}%` }}
                                                transition={{ delay: 0.8 + index * 0.1 }}
                                                className="h-full bg-gradient-to-r from-[#FF6B35] to-[#F7931E] rounded-full"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function AdminDashboard() {
    return (
        <ProtectedRoute requiredRole="ADMIN">
            <AdminDashboardContent />
        </ProtectedRoute>
    );
}
