"use client";

import HeaderModern from "../components/layout/HeaderModern";
import Footer from "../components/layout/Footer";
import PageHeader from "../components/shared/PageHeader";
import { Newspaper, Tag, Calendar, ArrowRight } from "lucide-react";
import { CATEGORIES, CATEGORY_COLORS } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { useState, useEffect } from "react";

interface NewsArticle {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    image: string;
    category: string;
    views: number;
    createdAt: string;
}

export default function ActualitesPage() {
    const [selectedCategory, setSelectedCategory] = useState("Tout");
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Récupérer les actualités depuis l'API
    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true);
                const res = await fetch('http://localhost:5000/api/news?limit=100');
                const data = await res.json();
                setNews(data.news || []);
                setError("");
            } catch (err) {
                console.error('Erreur lors du chargement des actualités:', err);
                setError("Impossible de charger les actualités");
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    const featuredArticle = news[0];

    // Filtrer les articles par catégorie
    const filteredArticles = selectedCategory === "Tout"
        ? news.slice(1)
        : news.slice(1).filter(article => article.category === selectedCategory);

    // Formater la date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Aujourd'hui";
        if (diffDays === 1) return "Hier";
        if (diffDays < 7) return `Il y a ${diffDays} jours`;
        if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaine${Math.floor(diffDays / 7) > 1 ? 's' : ''}`;
        if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`;
        return date.toLocaleDateString('fr-FR');
    };


    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <HeaderModern />

            <PageHeader
                icon={Newspaper}
                badge="Blog & News"
                title="Actualités"
                highlight="Automobiles"
                description="Restez informé des dernières nouveautés, essais et tendances du marché automobile."
            />

            <section className="py-12 max-w-7xl mx-auto px-6">
                {/* Categories */}
                <div className="flex flex-wrap gap-3 justify-center mb-12 -mt-8 relative z-20">
                    <button
                        onClick={() => setSelectedCategory("Tout")}
                        className={`px-6 py-2 rounded-full font-bold shadow-lg transition-all ${selectedCategory === "Tout"
                            ? "bg-[#FF6B35] text-white shadow-[#FF6B35]/30"
                            : "bg-white text-gray-600 hover:text-[#FF6B35] shadow-md hover:shadow-lg"
                            }`}
                    >
                        Tout
                    </button>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-6 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition-all ${selectedCategory === cat
                                ? "bg-[#FF6B35] text-white shadow-[#FF6B35]/30"
                                : "bg-white text-gray-600 hover:text-[#FF6B35]"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Featured Article */}
                {loading ? (
                    <div className="mb-16 h-[500px] bg-white rounded-3xl flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#FF6B35] mx-auto mb-4"></div>
                            <p className="text-gray-500 text-lg">Chargement des actualités...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="mb-16 h-[500px] bg-white rounded-3xl flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-red-500 text-lg mb-4">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-3 bg-[#FF6B35] hover:bg-[#E85D2E] text-white rounded-xl font-bold transition-all"
                            >
                                Réessayer
                            </button>
                        </div>
                    </div>
                ) : featuredArticle ? (
                    <div className="mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="group relative rounded-3xl overflow-hidden shadow-2xl h-[500px]"
                        >
                            <Image
                                src={featuredArticle.image}
                                alt={featuredArticle.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                            <div className="absolute bottom-0 left-0 p-8 md:p-12 max-w-4xl">
                                <span className="inline-block px-4 py-1 bg-[#FF6B35] text-white text-sm font-bold rounded-full mb-4">
                                    {featuredArticle.category}
                                </span>
                                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                                    {featuredArticle.title}
                                </h2>
                                <p className="text-gray-200 text-lg mb-6 line-clamp-2 max-w-2xl">
                                    {featuredArticle.excerpt}
                                </p>
                                <Link
                                    href={`/actualites/${featuredArticle.slug}`}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#1A1A2E] rounded-xl font-bold hover:bg-[#FF6B35] hover:text-white transition-all"
                                >
                                    Lire l'article complet <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                ) : null}

                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredArticles.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-500 text-lg">Aucun article dans cette catégorie.</p>
                            <button
                                onClick={() => setSelectedCategory("Tout")}
                                className="mt-4 px-6 py-3 bg-[#FF6B35] hover:bg-[#E85D2E] text-white rounded-xl font-bold transition-all"
                            >
                                Voir tous les articles
                            </button>
                        </div>
                    ) : (
                        filteredArticles.map((article, index) => (
                            <motion.div
                                key={article._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link href={`/actualites/${article.slug}`} className="group block h-full">
                                    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full flex flex-col group-hover:-translate-y-2">
                                        <div className="relative h-56 overflow-hidden">
                                            <Image
                                                src={article.image}
                                                alt={article.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-bold text-[#FF6B35]">
                                                {article.category}
                                            </div>
                                        </div>

                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(article.createdAt)}
                                            </div>

                                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#FF6B35] transition-colors line-clamp-2">
                                                {article.title}
                                            </h3>

                                            <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-1">
                                                {article.excerpt}
                                            </p>

                                            <div className="flex items-center text-[#FF6B35] font-bold text-sm group-hover:gap-2 transition-all mt-auto">
                                                Lire la suite <ArrowRight className="w-4 h-4 ml-1" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
