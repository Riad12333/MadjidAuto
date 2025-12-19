"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Newspaper, ChevronLeft, Plus, Search, Edit, Trash2, Eye,
    Calendar, User, TrendingUp
} from "lucide-react";
import ProtectedRoute from "../../components/ProtectedRoute";

interface NewsItem {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    image: string;
    category: string;
    views: number;
    createdAt: string;
}

function AdminNewsContent() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/news');
            const data = await res.json();
            setNews(data.news || []);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteNews = async (id: string) => {
        if (!confirm('Supprimer cet article ?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/news/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                setNews(news.filter(n => n._id !== id));
            } else {
                alert('Erreur lors de la suppression');
            }
        } catch (error) {
            console.error(error);
            alert('Erreur serveur');
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Nouveautés': return 'bg-blue-500/20 text-blue-400';
            case 'Prix': return 'bg-emerald-500/20 text-emerald-400';
            case 'Industrie': return 'bg-purple-500/20 text-purple-400';
            case 'Réglementation': return 'bg-orange-500/20 text-orange-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    const filteredNews = news.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase())
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
                            <h1 className="text-2xl font-bold">Gestion des Actualités</h1>
                            <p className="text-gray-500 text-sm">{news.length} articles publiés</p>
                        </div>
                    </div>
                    <Link
                        href="/admin/news/new"
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF6B35] to-[#F7931E] rounded-xl font-medium hover:opacity-90 transition-opacity"
                    >
                        <Plus className="w-5 h-5" />
                        Nouvel article
                    </Link>
                </div>
            </header>

            <main className="p-6">
                {/* Search */}
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Rechercher un article..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-96 pl-10 pr-4 py-3 bg-[#1E293B] border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FF6B35]"
                    />
                </div>

                {/* News Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <p className="text-gray-500 col-span-3 text-center py-12">Chargement...</p>
                    ) : filteredNews.length === 0 ? (
                        <p className="text-gray-500 col-span-3 text-center py-12">Aucun article trouvé</p>
                    ) : (
                        filteredNews.map((article, index) => (
                            <motion.div
                                key={article._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-[#1E293B] rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-colors group"
                            >
                                <div className="relative h-40 overflow-hidden">
                                    <img
                                        src={article.image || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400'}
                                        alt={article.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute top-3 left-3">
                                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getCategoryColor(article.category)}`}>
                                            {article.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <h3 className="font-bold mb-2 line-clamp-2">{article.title}</h3>
                                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{article.excerpt}</p>

                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(article.createdAt).toLocaleDateString('fr-FR')}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" />
                                            {article.views} vues
                                        </div>
                                    </div>

                                    <div className="flex gap-2 pt-4 border-t border-white/10">
                                        <Link
                                            href={`/actualites/${article.slug}`}
                                            className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm"
                                        >
                                            <Eye className="w-4 h-4" />
                                            Voir
                                        </Link>
                                        <button className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors text-sm">
                                            <Edit className="w-4 h-4" />
                                            Modifier
                                        </button>
                                        <button
                                            onClick={() => deleteNews(article._id)}
                                            className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors text-sm"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}

export default function AdminNews() {
    return (
        <ProtectedRoute requiredRole="ADMIN">
            <AdminNewsContent />
        </ProtectedRoute>
    );
}
