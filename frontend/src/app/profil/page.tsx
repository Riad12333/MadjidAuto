"use client";

import { useEffect, useState } from "react";
import HeaderModern from "../components/layout/HeaderModern";
import Footer from "../components/layout/Footer";
import ProtectedRoute from "../components/ProtectedRoute";
import { User, Mail, Phone, MapPin, Car, Trash2, Edit, Heart } from "lucide-react";
import CarForm from "../components/shared/CarForm";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { API_URL } from "@/lib/config";

export default function ProfilPage() {
    return (
        <ProtectedRoute requiredRole="USER">
            <ProfilContent />
        </ProtectedRoute>
    );
}

function ProfilContent() {
    const searchParams = useSearchParams();
    const [user, setUser] = useState<any>(null);
    const [favorites, setFavorites] = useState<any[]>([]);
    const [myCars, setMyCars] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState<'list' | 'add'>('list');
    const [activeTab, setActiveTab] = useState<'ads' | 'favorites'>('ads');
    const [editingCar, setEditingCar] = useState<any>(null);
    const [isEditingProfile, setIsEditingProfile] = useState(false);

    // Profile Edit States
    const [profileData, setProfileData] = useState({
        nom: "",
        prenom: "",
        email: "",
        phone: "",
        ville: ""
    });

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            const resProfile = await fetch(`${API_URL}/api/users/profile`, { headers });
            if (resProfile.ok) {
                const data = await resProfile.json();
                setUser(data);
                if (data.favorites) setFavorites(data.favorites);
                setProfileData({
                    nom: data.nom,
                    prenom: data.prenom,
                    email: data.email,
                    phone: data.phone || "",
                    ville: data.ville || ""
                });
            }

            const resCars = await fetch(`${API_URL}/api/cars/myads`, { headers });
            if (resCars.ok) {
                const data = await resCars.json();
                setMyCars(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (searchParams.get('tab') === 'add') {
            setView('add');
        }
        fetchProfile();
    }, [searchParams]);

    const handleEditCar = (car: any) => {
        setEditingCar(car);
        setView('add');
    };

    const handleDeleteCar = async (id: string) => {
        if (!confirm("Voulez-vous vraiment supprimer cette annonce ?")) return;

        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_URL}/api/cars/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMyCars(myCars.filter(c => c._id !== id));
        } catch (error) {
            alert("Erreur lors de la suppression");
        }
    };

    const handleRemoveFavorite = async (carId: string) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/users/favorites/${carId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setFavorites(favorites.filter(fav => fav._id !== carId));
            }
        } catch (error) {
            console.error("Error removing favorite", error);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profileData)
            });

            if (res.ok) {
                const updatedUser = await res.json();
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                if (updatedUser.token) {
                    localStorage.setItem('token', updatedUser.token);
                }
                setIsEditingProfile(false);
                alert('Profil mis à jour !');
            } else {
                const errorData = await res.json();
                alert(errorData.message || 'Erreur lors de la mise à jour');
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (isLoading) return <div className="min-h-screen pt-32 text-center">Chargement...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <HeaderModern />

            <div className="pt-32 pb-12 px-6 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-[#1A1A2E] mb-8">Mon Profil</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* User Info Card */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 h-fit">
                        {isEditingProfile ? (
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <h2 className="text-xl font-bold mb-4">Modifier mon profil</h2>
                                <div>
                                    <label className="text-sm font-bold">Prénom</label>
                                    <input value={profileData.prenom} onChange={e => setProfileData({ ...profileData, prenom: e.target.value })} className="w-full p-2 border rounded-lg" />
                                </div>
                                <div>
                                    <label className="text-sm font-bold">Nom</label>
                                    <input value={profileData.nom} onChange={e => setProfileData({ ...profileData, nom: e.target.value })} className="w-full p-2 border rounded-lg" />
                                </div>
                                <div>
                                    <label className="text-sm font-bold">Email</label>
                                    <input value={profileData.email} onChange={e => setProfileData({ ...profileData, email: e.target.value })} className="w-full p-2 border rounded-lg" />
                                </div>
                                <div>
                                    <label className="text-sm font-bold">Téléphone</label>
                                    <input value={profileData.phone} onChange={e => setProfileData({ ...profileData, phone: e.target.value })} className="w-full p-2 border rounded-lg" />
                                </div>
                                <div>
                                    <label className="text-sm font-bold">Ville</label>
                                    <input value={profileData.ville} onChange={e => setProfileData({ ...profileData, ville: e.target.value })} className="w-full p-2 border rounded-lg" />
                                </div>
                                <div className="flex gap-2">
                                    <button type="submit" className="flex-1 py-2 bg-[#FF6B35] text-white rounded-lg font-bold">Enregistrer</button>
                                    <button type="button" onClick={() => setIsEditingProfile(false)} className="flex-1 py-2 bg-gray-100 rounded-lg font-bold">Annuler</button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <div className="text-center mb-6">
                                    <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <User className="w-10 h-10 text-[#FF6B35]" />
                                    </div>
                                    <h2 className="text-xl font-bold">{user?.nom} {user?.prenom}</h2>
                                    <p className="text-gray-500">Membre depuis 2024</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Mail className="w-5 h-5" />
                                        <span>{user?.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Phone className="w-5 h-5" />
                                        <span>{user?.phone || "Non renseigné"}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <MapPin className="w-5 h-5" />
                                        <span>{user?.ville || "Alger"}</span>
                                    </div>
                                </div>

                                <button onClick={() => setIsEditingProfile(true)} className="w-full mt-8 py-3 outline outline-1 outline-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-colors">
                                    Modifier mes informations
                                </button>
                            </>
                        )}
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-6">

                        {view === 'list' ? (
                            <>
                                {/* Tabs */}
                                <div className="flex items-center gap-4 mb-6 border-b border-gray-200">
                                    <button
                                        onClick={() => setActiveTab('ads')}
                                        className={`pb-4 px-2 text-sm font-bold transition-colors relative ${activeTab === 'ads' ? 'text-[#FF6B35]' : 'text-gray-500 hover:text-gray-800'}`}
                                    >
                                        Mes Annonces ({myCars.length})
                                        {activeTab === 'ads' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF6B35]" />}
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('favorites')}
                                        className={`pb-4 px-2 text-sm font-bold transition-colors relative ${activeTab === 'favorites' ? 'text-[#FF6B35]' : 'text-gray-500 hover:text-gray-800'}`}
                                    >
                                        Mes Favoris ({favorites.length})
                                        {activeTab === 'favorites' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF6B35]" />}
                                    </button>
                                </div>

                                {activeTab === 'ads' && (
                                    <>
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-xl font-bold flex items-center gap-2">
                                                <Car className="w-6 h-6 text-[#FF6B35]" />
                                                Gérer mes véhicules
                                            </h2>
                                            <button
                                                onClick={() => {
                                                    setEditingCar(null);
                                                    setView('add');
                                                }}
                                                className="px-4 py-2 bg-[#FF6B35] text-white rounded-xl font-bold text-sm hover:bg-[#E85D2E]"
                                            >
                                                + Nouvelle Annonce
                                            </button>
                                        </div>

                                        {myCars.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {myCars.map((car) => (
                                                    <div key={car._id} className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all">
                                                        <div className="h-48 bg-gray-200 relative">
                                                            {car.images?.[0] ? (
                                                                <img src={car.images[0]} alt={car.modele} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                    <Car className="w-10 h-10" />
                                                                </div>
                                                            )}
                                                            <span className="absolute top-2 right-2 px-2 py-1 bg-white/90 rounded text-xs font-bold shadow-sm">
                                                                {car.prix.toLocaleString()} DA
                                                            </span>
                                                        </div>
                                                        <div className="p-4 flex-1 flex flex-col">
                                                            <h3 className="font-bold text-lg mb-1 truncate">{car.marque} {car.modele}</h3>
                                                            <p className="text-sm text-gray-500 mb-4">{car.annee} • {car.ville}</p>

                                                            <div className="mt-auto flex gap-2">
                                                                <button
                                                                    onClick={() => handleEditCar(car)}
                                                                    className="flex-1 py-2 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 flex items-center justify-center gap-2 transition-colors"
                                                                >
                                                                    <Edit className="w-4 h-4" /> Modifier
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteCar(car._id)}
                                                                    className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="bg-white rounded-2xl p-8 text-center border-dashed border-2 border-gray-200">
                                                <Car className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune annonce</h3>
                                                <p className="text-gray-500 mb-6">Vous n'avez pas encore publié d'annonce.</p>
                                                <button
                                                    onClick={() => {
                                                        setEditingCar(null);
                                                        setView('add');
                                                    }}
                                                    className="text-[#FF6B35] font-bold hover:underline"
                                                >
                                                    Commencer à vendre
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}

                                {activeTab === 'favorites' && (
                                    <>
                                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                            <Heart className="w-6 h-6 text-red-500" />
                                            Véhicules favoris
                                        </h2>

                                        {favorites.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {favorites.map((fav) => (
                                                    <div key={fav._id} className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all">
                                                        <Link href={`/occasions/${fav._id}`} className="block h-48 bg-gray-200 relative overflow-hidden">
                                                            {fav.images?.[0] ? (
                                                                <img src={fav.images[0]} alt={fav.modele} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                    <Car className="w-10 h-10" />
                                                                </div>
                                                            )}
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            <span className="absolute top-2 right-2 px-2 py-1 bg-white/90 rounded text-xs font-bold shadow-sm z-10">
                                                                {fav.prix.toLocaleString()} DA
                                                            </span>
                                                        </Link>
                                                        <div className="p-4 flex-1 flex flex-col">
                                                            <Link href={`/occasions/${fav._id}`} className="block">
                                                                <h3 className="font-bold text-lg mb-1 truncate hover:text-[#FF6B35] transition-colors">{fav.marque} {fav.modele}</h3>
                                                            </Link>
                                                            <p className="text-sm text-gray-500 mb-4">{fav.annee} • {fav.ville}</p>

                                                            <div className="mt-auto">
                                                                <button
                                                                    onClick={() => handleRemoveFavorite(fav._id)}
                                                                    className="w-full py-2 bg-red-50 text-red-500 rounded-lg text-sm font-medium hover:bg-red-100 flex items-center justify-center gap-2 transition-colors"
                                                                >
                                                                    <Trash2 className="w-4 h-4" /> Retirer des favoris
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="bg-white rounded-2xl p-8 text-center border-dashed border-2 border-gray-200">
                                                <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun favori</h3>
                                                <p className="text-gray-500 mb-6">Vous n'avez ajouté aucun véhicule à vos favoris.</p>
                                                <Link
                                                    href="/occasions"
                                                    className="text-[#FF6B35] font-bold hover:underline"
                                                >
                                                    Parcourir les annonces
                                                </Link>
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                                <div className="mb-6 flex items-center gap-4">
                                    <button onClick={() => setView('list')} className="text-sm font-bold text-gray-500 hover:text-[#1A1A2E]">
                                        &larr; Retour à mes annonces
                                    </button>
                                    <h2 className="text-xl font-bold">
                                        {editingCar ? "Modifier l'annonce" : "Ajouter un véhicule"}
                                    </h2>
                                </div>
                                <CarForm
                                    onSuccess={() => {
                                        fetchProfile();
                                        setView('list');
                                        setEditingCar(null);
                                    }}
                                    initialData={editingCar}
                                />
                            </div>
                        )}

                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

