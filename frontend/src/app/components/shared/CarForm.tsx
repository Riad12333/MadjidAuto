"use client";
import { API_URL } from "@/lib/config";

import { useState } from "react";
import { CheckCircle } from "lucide-react";



interface CarFormProps {
    onSuccess: () => void;
    currentRole?: string;
    initialData?: any;
}

export default function CarForm({ onSuccess, currentRole = 'USER', initialData }: CarFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        marque: initialData?.marque || "",
        modele: initialData?.modele || "",
        version: initialData?.version || "",
        annee: initialData?.annee || "",
        km: initialData?.km || "",
        carburant: initialData?.carburant || "Essence",
        boite: initialData?.boite || "Manuelle",
        couleur: initialData?.couleur || "",
        prix: initialData?.prix || "",
        contactPhone: initialData?.contactPhone || "",
        description: initialData?.description || "",
        ville: initialData?.ville || "",
        isNew: initialData ? String(initialData.isNew) : "false",
    });

    // Store existing images URLs from initialData or empty strings
    const [existingImages, setExistingImages] = useState<string[]>([
        initialData?.images?.[0] || "",
        initialData?.images?.[1] || "",
        initialData?.images?.[2] || ""
    ]);

    // Store selected files
    const [imageFiles, setImageFiles] = useState<(File | null)[]>([null, null, null]);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        if (e.target.files && e.target.files[0]) {
            const newFiles = [...imageFiles];
            newFiles[index] = e.target.files[0];
            setImageFiles(newFiles);
        }
    };

    const uploadImage = async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);

        const res = await fetch(`${API_URL}/api/upload`, {
            method: 'POST',
            body: formData
        });

        if (!res.ok) throw new Error('Upload failed');
        const data = await res.json();
        // Backend returns filePath like '/uploads/file.jpg', we need full URL
        return `${API_URL}${data.filePath}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            const uploadedImageUrls: string[] = [];

            // 1. Upload new files if any
            for (let i = 0; i < 3; i++) {
                if (imageFiles[i]) {
                    const url = await uploadImage(imageFiles[i]!);
                    uploadedImageUrls.push(url);
                } else if (existingImages[i]) {
                    // Keep existing image if no new file selected
                    uploadedImageUrls.push(existingImages[i]);
                }
            }

            const body = {
                ...formData,
                isNew: formData.isNew === 'true',
                prix: Number(formData.prix),
                annee: Number(formData.annee),
                km: Number(formData.km),
                images: uploadedImageUrls.filter(img => img !== "")
            };

            const url = initialData
                ? `${API_URL}/api/cars/${initialData._id}`
                : `${API_URL}/api/cars`;

            const method = initialData ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                alert(initialData ? 'Annonce modifiée avec succès !' : 'Annonce publiée avec succès !');
                onSuccess();
            } else {
                const data = await res.json();
                alert(data.message || 'Erreur lors de l\'opération');
            }
        } catch (error) {
            console.error(error);
            alert('Erreur serveur ou upload échoué');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Type Annonce */}
            <div>
                <h3 className="text-xl font-bold text-[#1A1A2E] mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-[#FF6B35] text-white flex items-center justify-center text-sm">1</span>
                    Type de véhicule
                </h3>
                <div className="flex gap-4">
                    <label className={`flex-1 p-4 border rounded-xl cursor-pointer transition-all ${formData.isNew === 'false' ? 'border-[#FF6B35] bg-[#FF6B35]/5' : 'border-gray-200'}`}>
                        <input
                            type="radio"
                            name="isNew"
                            value="false"
                            checked={formData.isNew === 'false'}
                            onChange={handleChange}
                            className="hidden"
                        />
                        <div className="text-center font-bold">Occasion</div>
                    </label>
                    <label className={`flex-1 p-4 border rounded-xl cursor-pointer transition-all ${formData.isNew === 'true' ? 'border-[#FF6B35] bg-[#FF6B35]/5' : 'border-gray-200'}`}>
                        <input
                            type="radio"
                            name="isNew"
                            value="true"
                            checked={formData.isNew === 'true'}
                            onChange={handleChange}
                            className="hidden"
                        />
                        <div className="text-center font-bold">Neuf (0 km)</div>
                    </label>
                </div>
            </div>

            {/* Infos Véhicule */}
            <div>
                <h3 className="text-xl font-bold text-[#1A1A2E] mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-[#FF6B35] text-white flex items-center justify-center text-sm">2</span>
                    Informations du véhicule
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Marque</label>
                        <input name="marque" value={formData.marque} onChange={handleChange} placeholder="Ex: Renault" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B35]" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Modèle</label>
                        <input name="modele" value={formData.modele} onChange={handleChange} placeholder="Ex: Clio 4" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B35]" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Version</label>
                        <input name="version" value={formData.version} onChange={handleChange} placeholder="Ex: GT Line" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B35]" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Année</label>
                        <input type="number" name="annee" value={formData.annee} onChange={handleChange} placeholder="2020" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B35]" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Kilométrage</label>
                        <input type="number" name="km" value={formData.km} onChange={handleChange} placeholder="Ex: 120000" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B35]" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Carburant</label>
                        <select name="carburant" value={formData.carburant} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B35]">
                            <option>Essence</option>
                            <option>Diesel</option>
                            <option>GPL</option>
                            <option>Hybride</option>
                            <option>Electrique</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Boite</label>
                        <select name="boite" value={formData.boite} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B35]">
                            <option>Manuelle</option>
                            <option>Automatique</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Couleur</label>
                        <input name="couleur" value={formData.couleur} onChange={handleChange} placeholder="Ex: Blanche" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B35]" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Ville</label>
                        <input name="ville" value={formData.ville} onChange={handleChange} placeholder="Ex: Alger" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B35]" required />
                    </div>
                </div>
            </div>

            {/* Photos */}
            <div>
                <h3 className="text-xl font-bold text-[#1A1A2E] mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-[#FF6B35] text-white flex items-center justify-center text-sm">3</span>
                    Photos (Importation)
                </h3>
                <div className="space-y-4">
                    {[0, 1, 2].map((index) => (
                        <div key={index} className="flex items-center gap-4">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, index)}
                                className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-[#FF6B35]/10 file:text-[#FF6B35]
                                hover:file:bg-[#FF6B35]/20"
                            />
                            {existingImages[index] && !imageFiles[index] && (
                                <span className="text-xs text-green-600 font-bold">Image actuelle conservée</span>
                            )}
                        </div>
                    ))}
                    <p className="text-xs text-gray-500">Formats supportés: JPG, PNG, WEBP.</p>
                </div>
            </div>

            {/* Prix & Contact */}
            <div>
                <h3 className="text-xl font-bold text-[#1A1A2E] mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-[#FF6B35] text-white flex items-center justify-center text-sm">4</span>
                    Prix & Contact
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Prix (DA)</label>
                        <input type="number" name="prix" value={formData.prix} onChange={handleChange} placeholder="Ex: 2 500 000" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B35]" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Téléphone</label>
                        <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleChange} placeholder="05 55..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B35]" required />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                        <textarea rows={4} name="description" value={formData.description} onChange={handleChange} placeholder="Décrivez votre véhicule..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B35]"></textarea>
                    </div>
                </div>
            </div>

            <button
                disabled={isLoading}
                className="w-full py-4 bg-[#FF6B35] hover:bg-[#E85D2E] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#FF6B35]/30 flex items-center justify-center gap-2 text-lg disabled:opacity-50"
            >
                {isLoading ? (initialData ? "Modification..." : "Publication...") : (
                    <>
                        <CheckCircle className="w-6 h-6" />
                        {initialData ? "Modifier annonce" : "Publier mon annonce"}
                    </>
                )}
            </button>

        </form>
    );
}
