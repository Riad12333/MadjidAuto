"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BRANDS } from "@/lib/data";

export default function BrandsCarousel() {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 300;
            if (direction === "left") {
                current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: "smooth" });
            }
        }
    };

    return (
        <div className="relative group">
            {/* Navigation Buttons */}
            <button
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 backdrop-blur shadow-lg rounded-full flex items-center justify-center text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#FF6B35] hover:text-white -ml-4"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>

            <button
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 backdrop-blur shadow-lg rounded-full flex items-center justify-center text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#FF6B35] hover:text-white -mr-4"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Scrollable Container */}
            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth py-4 px-2"
                style={{ scrollSnapType: "x mandatory" }}
            >
                {BRANDS.map((brand) => (
                    <Link
                        key={brand.name}
                        href={`/occasions?marque=${encodeURIComponent(brand.name)}`}
                        className="flex-shrink-0 scroll-snap-align-start"
                    >
                        <div className="flex items-center gap-4 px-6 py-3 bg-white rounded-full border border-gray-100 shadow-sm hover:shadow-md hover:border-[#FF6B35] transition-all group/brand min-w-[180px]">
                            <div className="relative w-8 h-8 flex-shrink-0">
                                <Image
                                    src={brand.logo}
                                    alt={brand.name}
                                    fill
                                    className="object-contain grayscale group-hover/brand:grayscale-0 transition-all duration-300"
                                />
                            </div>
                            <span className="font-bold text-gray-700 group-hover/brand:text-[#FF6B35] transition-colors">
                                {brand.name}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
