"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, X, User, Car, ChevronDown, LogOut } from "lucide-react";
import clsx from "clsx";

export default function HeaderModern() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);

        const storedUser = localStorage.getItem('user');
        if (storedUser && storedUser !== "undefined") {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user from local storage", e);
                localStorage.removeItem('user');
            }
        }

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/connexion';
    };

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className={clsx(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                    isScrolled ? "py-2" : "py-4"
                )}
            >
                <div
                    className={clsx(
                        "mx-auto max-w-7xl px-6 transition-all duration-300",
                        isScrolled
                            ? "bg-white/80 backdrop-blur-md shadow-lg rounded-full border border-white/20 mx-4 mt-2"
                            : "bg-transparent"
                    )}
                >
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="relative w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-[#F7931E] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <Car className="text-white w-6 h-6" />
                                <div className="absolute -inset-1 bg-[#FF6B35] rounded-xl blur opacity-30 group-hover:opacity-60 transition-opacity" />
                            </div>
                            <div className="flex flex-col">
                                <span className={clsx("text-2xl font-bold leading-none tracking-tight", isScrolled ? "text-gray-900" : "text-white")}>
                                    Madjid<span className="text-[#FF6B35]">Auto</span>
                                </span>
                                <span className={clsx("text-[10px] font-medium tracking-widest uppercase opacity-70", isScrolled ? "text-gray-500" : "text-gray-300")}>
                                    Premium
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden lg:flex items-center gap-8">
                            <Link
                                href="/voitures-neuves"
                                className={clsx(
                                    "text-sm font-medium transition-colors hover:text-[#FF6B35] relative group",
                                    isScrolled ? "text-gray-700" : "text-white/90"
                                )}
                            >
                                Voitures Neuves
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF6B35] transition-all duration-300 group-hover:w-full" />
                            </Link>
                            <Link
                                href="/occasions"
                                className={clsx(
                                    "text-sm font-medium transition-colors hover:text-[#FF6B35] relative group",
                                    isScrolled ? "text-gray-700" : "text-white/90"
                                )}
                            >
                                Occasions
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF6B35] transition-all duration-300 group-hover:w-full" />
                            </Link>
                            <Link
                                href="/concessionnaires"
                                className={clsx(
                                    "text-sm font-medium transition-colors hover:text-[#FF6B35] relative group",
                                    isScrolled ? "text-gray-700" : "text-white/90"
                                )}
                            >
                                Concessionnaires
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF6B35] transition-all duration-300 group-hover:w-full" />
                            </Link>
                            <Link
                                href="/actualites"
                                className={clsx(
                                    "text-sm font-medium transition-colors hover:text-[#FF6B35] relative group",
                                    isScrolled ? "text-gray-700" : "text-white/90"
                                )}
                            >
                                Actualités
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF6B35] transition-all duration-300 group-hover:w-full" />
                            </Link>
                        </nav>

                        {/* Actions */}
                        <div className="hidden lg:flex items-center gap-4">
                            <Link
                                href="/occasions"
                                className={clsx("p-2 rounded-full transition-colors", isScrolled ? "hover:bg-gray-100 text-gray-700" : "hover:bg-white/10 text-white")}
                                title="Rechercher"
                            >
                                <Search className="w-5 h-5" />
                            </Link>
                            {user ? (
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={user.role === 'SHOWROOM' ? '/dashboard' : '/profil'}
                                        className="px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white rounded-full font-medium text-sm transition-all flex items-center gap-2"
                                    >
                                        <User className={clsx("w-4 h-4", isScrolled ? "text-gray-900" : "text-white")} />
                                        <span className={clsx(isScrolled ? "text-gray-900" : "text-white")}>
                                            {user.prenom}
                                        </span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="p-2.5 bg-[#FF6B35] hover:bg-[#E85D2E] text-white rounded-full transition-all shadow-lg"
                                        title="Se déconnecter"
                                    >
                                        <LogOut className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    href="/connexion"
                                    className="px-5 py-2.5 bg-[#FF6B35] hover:bg-[#E85D2E] text-white rounded-full font-medium text-sm transition-all shadow-lg shadow-[#FF6B35]/30 hover:shadow-[#FF6B35]/50 hover:-translate-y-0.5 flex items-center gap-2"
                                >
                                    <User className="w-4 h-4" />
                                    Connexion
                                </Link>
                            )}
                        </div>

                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className={clsx("lg:hidden p-2", isScrolled ? "text-gray-900" : "text-white")}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-[60] bg-white/95 backdrop-blur-xl lg:hidden"
                    >
                        <div className="p-6 h-full flex flex-col">
                            <div className="flex justify-between items-center mb-8">
                                <span className="text-2xl font-bold text-gray-900">Menu</span>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-gray-100 rounded-full">
                                    <X className="w-6 h-6 text-gray-900" />
                                </button>
                            </div>

                            <nav className="flex flex-col gap-6 text-lg font-medium">
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0 }}
                                >
                                    <Link
                                        href="/voitures-neuves"
                                        className="flex items-center justify-between py-2 border-b border-gray-100"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Voitures Neuves
                                        <ChevronDown className="w-4 h-4 -rotate-90 text-gray-400" />
                                    </Link>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <Link
                                        href="/occasions"
                                        className="flex items-center justify-between py-2 border-b border-gray-100"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Occasions
                                        <ChevronDown className="w-4 h-4 -rotate-90 text-gray-400" />
                                    </Link>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <Link
                                        href="/concessionnaires"
                                        className="flex items-center justify-between py-2 border-b border-gray-100"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Concessionnaires
                                        <ChevronDown className="w-4 h-4 -rotate-90 text-gray-400" />
                                    </Link>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <Link
                                        href="/actualites"
                                        className="flex items-center justify-between py-2 border-b border-gray-100"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Actualités
                                        <ChevronDown className="w-4 h-4 -rotate-90 text-gray-400" />
                                    </Link>
                                </motion.div>
                            </nav>

                            <div className="mt-auto space-y-4">
                                <Link
                                    href="/connexion"
                                    className="block w-full py-4 text-center bg-[#1A1A2E] text-white rounded-xl font-bold"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Se connecter
                                </Link>
                                <Link
                                    href="/inscription"
                                    className="block w-full py-4 text-center border-2 border-[#1A1A2E] text-[#1A1A2E] rounded-xl font-bold"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Créer un compte
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
