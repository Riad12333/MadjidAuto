"use client";

import { useState, useEffect } from "react";
import HeaderModern from "../components/layout/HeaderModern";
import Footer from "../components/layout/Footer";
import ProtectedRoute from "../components/ProtectedRoute";
import { User, MapPin, Phone, Car, Plus, Settings, Save, AlertCircle } from "lucide-react";
import CarForm from "../components/shared/CarForm";
import { API_URL } from "@/lib/config";

export default function DashboardPage() {
    return (
        <ProtectedRoute requiredRole="SHOWROOM">
            <DashboardContent />
        </ProtectedRoute>
    );
}

function DashboardContent() {
    const [activeTab, setActiveTab] = useState("overview");
    const [showroom, setShowroom] = useState<any>(null);
    const [cars, setCars] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        nom: "",
        description: "",
        ville: "",
        adresse: "",
        telephone: "",
        email: "",
        horaires: "",
        googleMapLink: "",
        logo: "",
        coverImage: ""
    });

    const [editingCar, setEditingCar] = useState<any>(null);

    const handleDeleteCar = async (id: string) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/cars/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                fetchData();
            } else {
                alert("Erreur lors de la suppression");
            }
        } catch (e) {
            console.error(e);
            alert("Erreur serveur");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            // Fetch Showroom Data
            const resShowroom = await fetch(`${API_URL}/api/showrooms/mine`, { headers });
            if (resShowroom.ok) {
                const data = await resShowroom.json();
                setShowroom(data);
                setFormData({
                    nom: data.nom || "",
                    description: data.description || "",
                    ville: data.ville || "",
                    adresse: data.adresse || "",
                    telephone: data.telephone || "",
                    email: data.email || "",
                    horaires: data.horaires || "",
                    googleMapLink: data.location?.googleMapLink || "",
                    logo: data.logo || "",
                    coverImage: data.coverImage || ""
                });
            }

            // Fetch Cars
            const resCars = await fetch(`${API_URL}/api/cars/myads`, { headers });
            if (resCars.ok) {
                const data = await resCars.json();
                setCars(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveShowroom = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const method = showroom ? 'PUT' : 'POST';

        try {
            const res = await fetch(`${API_URL}/api/showrooms`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    location: { googleMapLink: formData.googleMapLink }
                })
            });

            if (res.ok) {
                alert('Profil sauvegardé avec succès !');
                fetchData();
            } else {
                const errorData = await res.json();
                alert(errorData.message || 'Erreur lors de la sauvegarde');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('image', file);

        try {
            const res = await fetch(`${API_URL}/api/upload`, {
                method: 'POST',
                body: uploadData,
            });

            const data = await res.json();
            if (res.ok) {
                setFormData(prev => ({ ...prev, [field]: data.filePath }));
            } else {
                alert(data.message || 'Erreur upload');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Erreur lors de l\'upload');
        }
    };

    if (isLoading) return <div className="min-h-screen pt-32 text-center">Chargement...</div>;

    return (
        <div className="min-h-screen bg-gray-50 text-[#1A1A2E]">
            <HeaderModern />

            <div className="pt-28 pb-12 px-6 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 bg-white rounded-2xl shadow-sm p-6 h-fit">
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <User className="w-8 h-8 text-gray-400" />
                            </div>
                            <h2 className="font-bold text-lg">{showroom?.nom || "Mon Showroom"}</h2>
                            <p className="text-sm text-gray-500">Concessionnaire</p>
                        </div>

                        <nav className="space-y-2">
                            <button
                                onClick={() => setActiveTab("overview")}
                                className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === "overview" ? "bg-[#FF6B35] text-white" : "hover:bg-gray-50 text-gray-600"}`}
                            >
                                Vue d'ensemble
                            </button>
                            <button
                                onClick={() => setActiveTab("stock")}
                                className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === "stock" ? "bg-[#FF6B35] text-white" : "hover:bg-gray-50 text-gray-600"}`}
                            >
                                Mon Stock
                            </button>
                            <button
                                onClick={() => setActiveTab("settings")}
                                className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === "settings" ? "bg-[#FF6B35] text-white" : "hover:bg-gray-50 text-gray-600"}`}
                            >
                                Paramètres
                            </button>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {/* ALERT if no showroom created */}
                        {!showroom && activeTab !== 'settings' && (
                            <div className="bg-orange-50 border border-orange-200 text-orange-800 p-6 rounded-2xl mb-6 flex items-start gap-4">
                                <AlertCircle className="w-6 h-6 shrink-0" />
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Finalisez votre profil</h3>
                                    <p>Vous devez compléter les informations de votre showroom avant de pouvoir publier des véhicules.</p>
                                    <button
                                        onClick={() => setActiveTab('settings')}
                                        className="mt-4 px-4 py-2 bg-[#FF6B35] text-white rounded-lg font-bold text-sm"
                                    >
                                        Configurer mon profil
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === "overview" && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white p-6 rounded-2xl shadow-sm">
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                            <Car className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-gray-500 font-medium">Véhicules</h3>
                                    </div>
                                    <p className="text-3xl font-bold">{cars.length}</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm">
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                                            <MapPin className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-gray-500 font-medium">Ville</h3>
                                    </div>
                                    <p className="text-lg font-bold truncate">{showroom?.ville || "-"}</p>
                                </div>
                            </div>
                        )}

                        {activeTab === "stock" && (
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold">Mon Stock</h2>
                                    <button
                                        onClick={() => {
                                            setEditingCar(null);
                                            setActiveTab('add-car');
                                        }}
                                        className="px-4 py-2 bg-[#FF6B35] text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#E85D2E]"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Publier une annonce
                                    </button>
                                </div>

                                {cars.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {cars.map((car) => (
                                            <div key={car._id} className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                                                <div className="h-40 bg-gray-200 relative">
                                                    {car.images?.[0] && (
                                                        <img src={car.images[0].startsWith('http') ? car.images[0] : `${API_URL}/${car.images[0].replace(/\\/g, '/').replace(/^\//, '')}`} alt={car.modele} className="w-full h-full object-cover" />
                                                    )}
                                                    <span className="absolute top-2 right-2 px-2 py-1 bg-white/90 rounded-md text-xs font-bold">
                                                        {car.isNew ? 'NEUF' : 'OCCASION'}
                                                    </span>
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="font-bold text-lg mb-1">{car.marque} {car.modele}</h3>
                                                    <p className="text-[#FF6B35] font-bold">{car.prix.toLocaleString()} DA</p>
                                                    <div className="mt-4 flex gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setEditingCar(car);
                                                                setActiveTab('add-car');
                                                            }}
                                                            className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200"
                                                        >
                                                            Modifier
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteCar(car._id)}
                                                            className="px-3 py-2 bg-red-50 text-red-500 rounded-lg text-sm font-medium hover:bg-red-100"
                                                        >
                                                            Supprimer
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-gray-500">
                                        Aucun véhicule publié pour le moment.
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "add-car" && (
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <div className="mb-6 flex items-center gap-4">
                                    <button
                                        onClick={() => {
                                            setActiveTab('stock');
                                            setEditingCar(null);
                                        }}
                                        className="text-sm font-bold text-gray-500 hover:text-[#1A1A2E]"
                                    >
                                        &larr; Retour au stock
                                    </button>
                                    <h2 className="text-xl font-bold">{editingCar ? "Modifier le véhicule" : "Ajouter un véhicule"}</h2>
                                </div>
                                <CarForm
                                    initialData={editingCar}
                                    onSuccess={() => {
                                        fetchData();
                                        setActiveTab('stock');
                                        setEditingCar(null);
                                    }}
                                    currentRole="SHOWROOM"
                                />
                            </div>
                        )}


                        {activeTab === "settings" && (
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h2 className="text-xl font-bold mb-6">Paramètres du Showroom</h2>
                                <form onSubmit={handleSaveShowroom} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Nom du Showroom</label>
                                            <input
                                                value={formData.nom}
                                                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                                className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#FF6B35]/20"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Téléphone</label>
                                            <input
                                                value={formData.telephone}
                                                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                                                className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#FF6B35]/20"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Ville</label>
                                            <input
                                                value={formData.ville}
                                                onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                                                className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#FF6B35]/20"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Adresse</label>
                                            <input
                                                value={formData.adresse}
                                                onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                                                className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#FF6B35]/20"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Logo</label>
                                            <div className="flex items-center gap-4">
                                                {formData.logo && (
                                                    <img src={formData.logo.startsWith('http') ? formData.logo : `${API_URL}${formData.logo}`} alt="Logo" className="w-16 h-16 rounded-full object-cover border" />
                                                )}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleImageUpload(e, 'logo')}
                                                    className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#FF6B35]/20"
                                                />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Image de Couverture</label>
                                            <div className="flex flex-col gap-4">
                                                {formData.coverImage && (
                                                    <img src={formData.coverImage.startsWith('http') ? formData.coverImage : `${API_URL}${formData.coverImage}`} alt="Cover" className="w-full h-32 object-cover rounded-xl border" />
                                                )}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleImageUpload(e, 'coverImage')}
                                                    className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#FF6B35]/20"
                                                />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Lien Google Maps (Embed ou Lien)</label>
                                            <input
                                                value={formData.googleMapLink}
                                                onChange={(e) => setFormData({ ...formData, googleMapLink: e.target.value })}
                                                placeholder="https://goo.gl/maps/..."
                                                className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#FF6B35]/20"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Copiez le lien de partage ou d'intégration depuis Google Maps.</p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#FF6B35]/20 h-32"
                                            />
                                        </div>
                                    </div>
                                    <button onClick={handleSaveShowroom} className="px-6 py-3 bg-[#FF6B35] hover:bg-[#E85D2E] text-white rounded-xl font-bold transition-all flex items-center gap-2">
                                        <Save className="w-5 h-5" />
                                        Enregistrer les modifications
                                    </button>
                                </form>
                            </div>
                        )}
                    </main>
                </div>
            </div>
            <Footer />
        </div>
    );
}
