import Link from "next/link";
import { Car, Facebook, Instagram, Twitter, MapPin, Phone, Mail, ChevronRight } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#1A1A2E] text-white pt-20 pb-10 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-[#F7931E] rounded-xl flex items-center justify-center shadow-lg">
                                <Car className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold">
                                Madjid<span className="text-[#FF6B35]">Auto</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            La première plateforme automobile en Algérie. Trouvez votre prochaine voiture neuve ou d'occasion en toute confiance.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Instagram, Twitter].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#FF6B35] hover:text-white transition-all">
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Liens Rapides */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Liens Rapides</h3>
                        <ul className="space-y-4">
                            {[
                                { name: "Voitures Neuves", href: "/voitures-neuves" },
                                { name: "Voitures d'Occasion", href: "/occasions" },
                                { name: "Concessionnaires", href: "/concessionnaires" },
                                { name: "Actualités Auto", href: "/actualites" },
                                { name: "Estimer mon véhicule", href: "/estimation" }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="text-gray-400 hover:text-[#FF6B35] transition-colors flex items-center gap-2 group">
                                        <ChevronRight className="w-4 h-4 text-[#FF6B35] opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <span className="group-hover:translate-x-1 transition-transform">{item.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Marques */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Marques Populaires</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {["RENAULT", "PEUGEOT", "HYUNDAI", "KIA", "VOLKSWAGEN", "FIAT", "TOYOTA", "DACIA"].map((brand) => (
                                <Link key={brand} href={`/occasions?marque=${brand}`} className="text-gray-400 hover:text-[#FF6B35] text-sm transition-colors">
                                    {brand}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Contact</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-gray-400">
                                <MapPin className="w-5 h-5 text-[#FF6B35] mt-1" />
                                <span>Alger, Algérie</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <Phone className="w-5 h-5 text-[#FF6B35]" />
                                <span>+213 555 123 456</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <Mail className="w-5 h-5 text-[#FF6B35]" />
                                <span>contact@dzairauto.dz</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                    <p>© 2025 MadjidAuto. Tous droits réservés.</p>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-white transition-colors">Conditions d'utilisation</Link>
                        <Link href="#" className="hover:text-white transition-colors">Politique de confidentialité</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
