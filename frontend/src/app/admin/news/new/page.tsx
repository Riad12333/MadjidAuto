"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, Newspaper, Save, Image as ImageIcon, FileText, Tag, AlignLeft } from "lucide-react";

export default function NewNewsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        title: '',
        excerpt: '',
        content: '',
        image: '',
        category: 'Nouveautés'
    });

    const categories = ['Nouveautés', 'Prix', 'Industrie', 'Réglementation', 'Essais'];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:5000/api/news', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });

            if (res.ok) {
                router.push('/admin/news');
            } else {
                const data = await res.json();
                alert(data.message || 'Erreur lors de la création');
            }
        } catch (error) {
            alert('Erreur serveur');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-[#0F172A] text-white">
            <header className="sticky top-0 z-40 bg-[#0F172A]/80 backdrop-blur-xl border-b border-white/10 px-6 py-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/news" className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10">
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Nouvel Article</h1>
                        <p className="text-gray-500 text-sm">Publier une nouvelle actualité</p>
                    </div>
                </div>
            </header>

            <main className="p-6 max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Main Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#1E293B] rounded-2xl border border-white/10 p-6"
                    >
                        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Newspaper className="w-5 h-5 text-[#FF6B35]" />
                            Informations Générales
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Titre *</label>
                                <input
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#FF6B35]"
                                    placeholder="Titre de l'article"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Catégorie *</label>
                                <div className="relative">
                                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <select
                                        name="category"
                                        value={form.category}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#FF6B35] appearance-none"
                                    >
                                        {categories.map(c => <option key={c} value={c} className="bg-[#1E293B]">{c}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Image URL</label>
                                <div className="relative">
                                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        name="image"
                                        value={form.image}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#FF6B35]"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-[#1E293B] rounded-2xl border border-white/10 p-6"
                    >
                        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-[#FF6B35]" />
                            Contenu
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Extrait (Introduction) *</label>
                                <textarea
                                    name="excerpt"
                                    value={form.excerpt}
                                    onChange={handleChange}
                                    required
                                    rows={3}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#FF6B35]"
                                    placeholder="Un bref résumé qui apparaîtra sur les cartes..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Contenu Complet *</label>
                                <div className="relative">
                                    <AlignLeft className="absolute left-3 top-4 w-5 h-5 text-gray-500" />
                                    <textarea
                                        name="content"
                                        value={form.content}
                                        onChange={handleChange}
                                        required
                                        rows={12}
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#FF6B35]"
                                        placeholder="Le contenu détaillé de votre article..."
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="flex justify-end gap-4">
                        <Link
                            href="/admin/news"
                            className="px-6 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            Annuler
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-[#F7931E] rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            <Save className="w-5 h-5" />
                            {loading ? 'Publication...' : 'Publier'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
