"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Search,
    Menu,
    X,
    ChevronDown,
    User,
    Car,
    Building2,
    Newspaper,
    Calculator,
    Sparkles
} from "lucide-react";

const brands = [
    { name: "RENAULT", slug: "renault" },
    { name: "PEUGEOT", slug: "peugeot" },
    { name: "HYUNDAI", slug: "hyundai" },
    { name: "KIA", slug: "kia" },
    { name: "VOLKSWAGEN", slug: "volkswagen" },
    { name: "FIAT", slug: "fiat" },
    { name: "TOYOTA", slug: "toyota" },
    { name: "DACIA", slug: "dacia" },
    { name: "CITROËN", slug: "citroen" },
    { name: "CHERY", slug: "chery" },
    { name: "GEELY", slug: "geely" },
    { name: "BYD", slug: "byd" },
];

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isBrandsOpen, setIsBrandsOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full">
            {/* Top Bar avec gradient moderne */}
            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-2.5 text-sm border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5">
                            <span className="text-lg">🇩🇿</span>
                            <span className="font-medium">Algérie</span>
                        </span>
                        <span className="text-gray-600">|</span>
                        <span className="text-gray-400 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" />
                            Prix en Dinar Algérien (DA)
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="px-3 py-1 bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] text-white font-semibold rounded-full text-xs hover:shadow-lg transition-all">
                            FR
                        </button>
                        <span className="text-gray-600">|</span>
                        <button className="text-gray-400 hover:text-white transition-colors">EN</button>
                    </div>
                </div>
            </div>

            {/* Main Header avec glassmorphism */}
            <div className="bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-20">

                        {/* Logo moderne avec badge */}
                        <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
                            <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#D32F2F] to-[#B71C1C] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                                    <Car className="w-6 h-6 text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#FFB703] rounded-full border-2 border-white animate-pulse" />
                            </div>
                            <div>
                                <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                    Madjid<span className="bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] bg-clip-text">Auto</span>
                                </span>
                                <p className="text-[10px] text-gray-500 -mt-1 font-medium">Votre référence auto</p>
                            </div>
                        </Link>

                        {/* Desktop Navigation moderne */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {/* Voitures Neuves with Dropdown */}
                            <div
                                className="relative"
                                onMouseEnter={() => setIsBrandsOpen(true)}
                                onMouseLeave={() => setIsBrandsOpen(false)}
                            >
                                <button className="flex items-center gap-1 px-4 py-2.5 text-gray-700 hover:text-[#D32F2F] font-semibold rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all">
                                    Voitures Neuves
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isBrandsOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown moderne */}
                                {isBrandsOpen && (
                                    <div className="absolute top-full left-0 w-[520px] mt-2 bg-white/95 backdrop-blur-lg shadow-2xl rounded-2xl p-6 border border-gray-200/50 animate-fade-in">
                                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <div className="w-1 h-6 bg-gradient-to-b from-[#D32F2F] to-[#B71C1C] rounded-full" />
                                            Marques Populaires
                                        </h3>
                                        <div className="grid grid-cols-3 gap-2">
                                            {brands.map((brand) => (
                                                <Link
                                                    key={brand.slug}
                                                    href={`/marques/${brand.slug}`}
                                                    className="px-4 py-3 text-sm text-gray-600 hover:text-[#D32F2F] hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 rounded-xl transition-all font-medium"
                                                >
                                                    {brand.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Link href="/occasions" className="px-4 py-2.5 text-gray-700 hover:text-[#D32F2F] font-semibold rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all">
                                Occasions
                            </Link>
                            <Link href="/concessionnaires" className="px-4 py-2.5 text-gray-700 hover:text-[#D32F2F] font-semibold rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all">
                                Concessionnaires
                            </Link>
                            <Link href="/calcul-prix" className="px-4 py-2.5 text-gray-700 hover:text-[#D32F2F] font-semibold rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all">
                                Moins de 3 ans
                            </Link>
                            <Link href="/actualites" className="px-4 py-2.5 text-gray-700 hover:text-[#D32F2F] font-semibold rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all">
                                Actualités
                            </Link>
                        </nav>

                        {/* Auth Buttons modernes */}
                        <div className="hidden lg:flex items-center gap-3">
                            <Link
                                href="/connexion"
                                className="px-5 py-2.5 text-gray-700 hover:text-[#D32F2F] font-semibold transition-colors"
                            >
                                Connexion
                            </Link>
                            <Link
                                href="/inscription"
                                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#D32F2F]/30 transition-all hover:scale-105"
                            >
                                <User className="w-4 h-4" />
                                S'inscrire
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu moderne */}
            {isMenuOpen && (
                <div className="lg:hidden fixed inset-0 top-[120px] bg-white z-40 overflow-y-auto">
                    <nav className="p-6 space-y-3">
                        <Link href="/marques" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all group" onClick={() => setIsMenuOpen(false)}>
                            <div className="w-10 h-10 bg-gradient-to-br from-[#D32F2F]/10 to-[#B71C1C]/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Car className="w-5 h-5 text-[#D32F2F]" />
                            </div>
                            <span className="font-semibold text-gray-900">Voitures Neuves</span>
                        </Link>
                        <Link href="/occasions" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all group" onClick={() => setIsMenuOpen(false)}>
                            <div className="w-10 h-10 bg-gradient-to-br from-[#D32F2F]/10 to-[#B71C1C]/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Car className="w-5 h-5 text-[#D32F2F]" />
                            </div>
                            <span className="font-semibold text-gray-900">Occasions</span>
                        </Link>
                        <Link href="/concessionnaires" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all group" onClick={() => setIsMenuOpen(false)}>
                            <div className="w-10 h-10 bg-gradient-to-br from-[#D32F2F]/10 to-[#B71C1C]/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Building2 className="w-5 h-5 text-[#D32F2F]" />
                            </div>
                            <span className="font-semibold text-gray-900">Concessionnaires</span>
                        </Link>
                        <Link href="/calcul-prix" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all group" onClick={() => setIsMenuOpen(false)}>
                            <div className="w-10 h-10 bg-gradient-to-br from-[#D32F2F]/10 to-[#B71C1C]/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Calculator className="w-5 h-5 text-[#D32F2F]" />
                            </div>
                            <span className="font-semibold text-gray-900">Moins de 3 ans</span>
                        </Link>
                        <Link href="/actualites" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all group" onClick={() => setIsMenuOpen(false)}>
                            <div className="w-10 h-10 bg-gradient-to-br from-[#D32F2F]/10 to-[#B71C1C]/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Newspaper className="w-5 h-5 text-[#D32F2F]" />
                            </div>
                            <span className="font-semibold text-gray-900">Actualités</span>
                        </Link>

                        <div className="pt-6 mt-6 border-t border-gray-200 space-y-3">
                            <Link href="/connexion" className="block w-full p-4 text-center border-2 border-gray-200 rounded-2xl font-semibold hover:border-[#D32F2F] hover:text-[#D32F2F] transition-all" onClick={() => setIsMenuOpen(false)}>
                                Connexion
                            </Link>
                            <Link href="/inscription" className="block w-full p-4 text-center bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all" onClick={() => setIsMenuOpen(false)}>
                                S'inscrire
                            </Link>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
