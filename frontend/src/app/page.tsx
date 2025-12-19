// Server Component
export const dynamic = "force-dynamic";
import { API_URL } from "@/lib/config";

import HeaderModern from "./components/layout/HeaderModern";
import Footer from "./components/layout/Footer";
import HeroModern from "./components/home/HeroModern";
import GlassCard from "./components/ui/GlassCard";
import CarCardModern from "./components/shared/CarCardModern";
import NewsTimeline from "./components/home/NewsTimeline";
import BrandsCarousel from "./components/home/BrandsCarousel";
import PublishButton from "./components/home/PublishButton";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Star, MapPin, Phone, ChevronRight } from "lucide-react";
import { SHOWROOMS, NEWS, BRANDS, Car } from "@/lib/data";

// FETCH DATA FROM BACKEND
async function getCars(): Promise<Car[]> {
  try {
    const res = await fetch(`${API_URL}/api/cars?limit=100&isNew=false`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch cars");
    }

    const data = await res.json();
    return data.cars || [];
  } catch (error) {
    console.error("Error fetching cars:", error);
    return [];
  }
}

// FETCH SHOWROOMS
async function getShowrooms(): Promise<any[]> {
  try {
    const res = await fetch(`${API_URL}/api/showrooms`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed");
    return await res.json();
  } catch (error) {
    console.error("Error fetching showrooms:", error);
    return [];
  }
}

// FETCH NEWS
async function getNews(): Promise<any[]> {
  try {
    const res = await fetch(`${API_URL}/api/news?limit=5`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch news");
    const data = await res.json();
    return data.news || [];
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}

export default async function Home() {
  const cars = await getCars();
  const featuredCars = cars
    .filter(car => !car.isNew && car.images && car.images.length > 0)
    .slice(0, 4);
  const showrooms = await getShowrooms();
  const featuredShowrooms = showrooms.slice(0, 3);
  const news = await getNews();

  return (
    <div className="min-h-screen bg-[#F8F9FA] overflow-x-hidden">
      <HeaderModern />

      <main>
        {/* HERO SECTION */}
        <HeroModern />

        {/* MARQUES POPULAIRES (Carousel) */}
        <section className="py-12 bg-white border-b border-gray-100 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900">Marques Populaires</h2>
          </div>
          <div className="max-w-7xl mx-auto px-6">
            <BrandsCarousel />
          </div>
        </section>

        {/* CONCESSIONNAIRES (Glassmorphism) */}
        <section className="py-24 bg-gradient-to-b from-[#F8F9FA] to-white relative">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#FF6B35]/5 to-transparent pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
              <div>
                <span className="text-[#FF6B35] font-bold tracking-wider uppercase text-sm mb-2 block">Réseau Officiel</span>
                <h2 className="text-4xl md:text-5xl font-bold text-[#1A1A2E]">Concessionnaires</h2>
              </div>
              <Link href="/concessionnaires" className="group flex items-center gap-2 text-[#1A1A2E] font-bold hover:text-[#FF6B35] transition-colors mt-4 md:mt-0">
                Voir tout le réseau
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-[#FF6B35] group-hover:text-white transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredShowrooms.map((showroom) => (
                <GlassCard key={showroom._id} className="h-full">
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    {showroom.coverImage ? (
                      <img
                        src={showroom.coverImage.startsWith('http') ? showroom.coverImage : `${API_URL}${showroom.coverImage}`}
                        alt={showroom.nom}
                        className="w-full h-full object-cover"
                      />
                    ) : showroom.logo ? (
                      <img
                        src={showroom.logo.startsWith('http') ? showroom.logo : `${API_URL}${showroom.logo}`}
                        alt={showroom.nom}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="font-bold">{showroom.nom}</span>
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-[#FF6B35] text-xs font-bold shadow-sm">
                      <Star className="w-3 h-3 fill-current" /> {showroom.rating || 0}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
                        <span className="block text-2xl font-bold text-[#FF6B35]">{showroom.carsCount || 0}</span>
                        <span className="text-xs text-gray-500 uppercase font-bold">Voitures</span>
                      </div>
                      <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
                        <span className="block text-2xl font-bold text-[#1A1A2E]">24/7</span>
                        <span className="text-xs text-gray-500 uppercase font-bold">Support</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">{showroom.nom}</h3>
                      <div className="flex items-center gap-1 text-sm font-medium opacity-90 text-gray-500 mb-4">
                        <MapPin className="w-3 h-3" /> {showroom.ville}
                      </div>
                    </div>
                    <Link
                      href={`/concessionnaires/${showroom._id}`}
                      className="block w-full py-3 text-center rounded-xl border-2 border-[#1A1A2E] text-[#1A1A2E] font-bold hover:bg-[#1A1A2E] hover:text-white transition-all"
                    >
                      Visiter le Showroom
                    </Link>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* OCCASIONS (Modern Grid) */}
        <section className="py-24 bg-[#1A1A2E] text-white relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#FF6B35] rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#16213E] rounded-full blur-[120px]" />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
              <div>
                <span className="text-[#FF6B35] font-bold tracking-wider uppercase text-sm mb-2 block">Opportunités</span>
                <h2 className="text-4xl md:text-5xl font-bold">Dernières Occasions</h2>
              </div>
              <div className="flex gap-2 mt-4 md:mt-0">
                {/* Filters removed as requested */}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCars.length > 0 ? (
                featuredCars.map((car) => (
                  <CarCardModern key={car._id} car={car} />
                ))
              ) : (
                <p>Aucune voiture trouvée dans la base de données.</p>
              )}
            </div>

            <div className="mt-16 text-center">
              <Link
                href="/occasions"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#1A1A2E] rounded-full font-bold hover:bg-gray-100 transition-all hover:scale-105"
              >
                Voir toutes les annonces
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ACTUALITÉS (Timeline) */}
        <section className="py-24 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-[#FF6B35] font-bold tracking-wider uppercase text-sm mb-2 block">Blog & News</span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#1A1A2E]">Actualités Auto</h2>
            </div>

            <NewsTimeline news={news} />
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B35] to-[#F7931E]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />

          <div className="max-w-4xl mx-auto px-6 relative z-10 text-center text-white">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 font-display">Prêt à vendre votre voiture ?</h2>
            <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
              Rejoignez des milliers de vendeurs satisfaits. Publiez votre annonce gratuitement en moins de 2 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <PublishButton
                className="px-8 py-4 bg-white text-[#FF6B35] rounded-xl font-bold text-lg hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 block"
              >
                Publier une annonce gratuite
              </PublishButton>
              <Link
                href="/estimation"
                className="px-8 py-4 bg-[#1A1A2E]/20 backdrop-blur-md border border-white/30 text-white rounded-xl font-bold text-lg hover:bg-[#1A1A2E]/40 transition-all"
              >
                Estimer mon véhicule
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
