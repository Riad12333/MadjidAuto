"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import HeaderModern from "../../components/layout/HeaderModern";
import Footer from "../../components/layout/Footer";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, Eye, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import { motion } from "framer-motion";

interface Article {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image: string;
    category: string;
    views: number;
    createdAt: string;
    author?: {
        nom: string;
        prenom: string;
    };
}

export default function ArticlePage() {
    const params = useParams();
    const slug = params.slug as string;
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchArticle = async () => {
            if (!slug) return;

            const decodedSlug = decodeURIComponent(slug);
            console.log("Fetching article with slug:", decodedSlug);

            try {
                setLoading(true);
                const res = await fetch(`http://localhost:5000/api/news/slug/${decodedSlug}`);

                if (!res.ok) {
                    console.error("Fetch failed with status:", res.status);
                    throw new Error(`Article non trouvé (Slug: ${decodedSlug})`);
                }
                const data = await res.json();
                setArticle(data);
                setError("");
            } catch (err: any) {
                console.error('Erreur lors du chargement de l\'article:', err);
                setError(err.message || "Impossible de charger l'article");
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [slug]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <HeaderModern />
                <div className="max-w-4xl mx-auto px-6 py-20">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#FF6B35] mx-auto mb-4"></div>
                        <p className="text-gray-500 text-lg">Chargement de l'article...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="min-h-screen bg-white">
                <HeaderModern />
                <div className="max-w-4xl mx-auto px-6 py-20">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Article non trouvé</h1>
                        <p className="text-gray-600 mb-8">{error}</p>
                        <Link
                            href="/actualites"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF6B35] hover:bg-[#E85D2E] text-white rounded-xl font-bold transition-all"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Retour aux actualités
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <HeaderModern />

            {/* Hero Article */}
            <div className="relative h-[60vh] min-h-[500px]">
                <Image src={article.image} alt={article.title} fill className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E] via-[#1A1A2E]/50 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 pb-24 max-w-4xl mx-auto text-center">
                    <Link href="/actualites" className="inline-flex items-center gap-2 text-white/80 hover:text-[#FF6B35] transition-colors mb-6">
                        <ArrowLeft className="w-4 h-4" /> Retour aux actualités
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <span className="inline-block px-4 py-1 bg-[#FF6B35] text-white text-sm font-bold rounded-full mb-6 shadow-lg">
                            {article.category}
                        </span>

                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight font-display">
                            {article.title}
                        </h1>

                        <div className="flex items-center justify-center gap-6 text-gray-300 text-sm flex-wrap">
                            <span className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" /> {formatDate(article.createdAt)}
                            </span>
                            {article.author && (
                                <span className="flex items-center gap-2">
                                    <User className="w-4 h-4" /> Par {article.author.prenom} {article.author.nom}
                                </span>
                            )}
                            <span className="flex items-center gap-2">
                                <Eye className="w-4 h-4" /> {article.views} vues
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>

            <main className="max-w-3xl mx-auto px-6 -mt-12 relative z-10 pb-24">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100">

                    {/* Article Content */}
                    <div className="prose prose-lg prose-headings:font-bold prose-headings:text-[#1A1A2E] prose-p:text-gray-600 prose-a:text-[#FF6B35] max-w-none">
                        <p className="lead text-xl font-medium text-gray-800 mb-8 bg-[#FF6B35]/5 border-l-4 border-[#FF6B35] p-6 rounded-r-xl">
                            {article.excerpt}
                        </p>

                        <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {article.content}
                        </div>
                    </div>

                    {/* Share */}
                    <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between flex-wrap gap-4">
                        <span className="font-bold text-[#1A1A2E]">Partager cet article</span>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Linkedin, Share2].map((Icon, i) => (
                                <button key={i} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-[#FF6B35] hover:text-white transition-all">
                                    <Icon className="w-5 h-5" />
                                </button>
                            ))}
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
