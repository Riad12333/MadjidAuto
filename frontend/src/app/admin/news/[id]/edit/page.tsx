"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, Newspaper, Save, Image as ImageIcon, FileText, Tag, AlignLeft } from "lucide-react";

export default function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        title: '',
        excerpt: '',
        content: '',
        image: '',
        category: 'Nouveautés'
    });

    const categories = ['Nouveautés', 'Prix', 'Industrie', 'Réglementation', 'Essais'];

    useEffect(() => {
        const fetchArticle = async () => {
            // Note: Since we changed the public route to /slug/:slug, and we are using /:id for management.
            // But we don't have a GET /api/news/:id route explicitly for fetching by ID unless we added it or reusing slug route if it works.
            // Wait, I added `router.route('/:id').get(getNewsBySlug)`. getNewsBySlug searches by slug. 
            // If I pass ID, it won't find it. 
            // I need to add `getNewsById` to backend or allow `getNewsBySlug` to handle IDs. 
            // OR fetch all news and find locally (inefficient).
            // OR I should use `router.get('/:id', getNewsById)` in backend.
            // I missed adding `getNewsById` in backend newsController.
            // I'll fetch via a new endpoint or update fetched news logic if I can't change backend now?
            // BETTER: Add getNewsById to backend now. I already touched updated/deleted.

            // Temporary workaround assuming I can fix backend in next step:
            try {
                // Assuming I will add GET /api/news/id/:id
                const res = await fetch(`http://localhost:5000/api/news/id/${id}`);
                const data = await res.json();
                if (res.ok) {
                    setForm({
                        title: data.title || '',
                        excerpt: data.excerpt || '',
                        content: data.content || '',
                        image: data.image || '',
                        category: data.category || 'Nouveautés'
                    });
                } else {
                    alert('Article non trouvé');
                    router.push('/admin/news');
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchArticle();
    }, [id, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:5000/api/news/${id}`, {
                method: 'PUT',
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
                alert(data.message || 'Erreur lors de la modification');
            }
        } catch (error) {
            alert('Erreur serveur');
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    if (loading) return <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-white">Chargement...</div>;

    return (
        <div className="min-h-screen bg-[#0F172A] text-white">
            <header className="sticky top-0 z-40 bg-[#0F172A]/80 backdrop-blur-xl border-b border-white/10 px-6 py-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/news" className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10">
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Modifier Article</h1>
                        <p className="text-gray-500 text-sm">Éditer l'actualité</p>
                    </div>
                </div>
            </header>

            <main className="p-6 max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Main Info */}
                    <div className="bg-[#1E293B] rounded-2xl border border-white/10 p-6">
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
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="bg-[#1E293B] rounded-2xl border border-white/10 p-6">
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
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Link
                            href="/admin/news"
                            className="px-6 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            Annuler
                        </Link>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-[#F7931E] rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            <Save className="w-5 h-5" />
                            {submitting ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
