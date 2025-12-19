"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import type { NewsArticle } from "@/lib/data";

interface NewsTimelineProps {
    news: NewsArticle[];
}

export default function NewsTimeline({ news }: NewsTimelineProps) {
    return (
        <div className="relative pl-8 md:pl-0">
            {/* Timeline Line (Desktop) */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#FF6B35] via-gray-200 to-transparent transform -translate-x-1/2" />

            {/* Timeline Line (Mobile) */}
            <div className="md:hidden absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-[#FF6B35] via-gray-200 to-transparent" />

            <div className="space-y-12">
                {news.map((item: any, index) => (
                    <motion.div
                        key={item._id || index}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? "md:flex-row-reverse" : ""
                            }`}
                    >
                        {/* Dot */}
                        <div className="absolute left-[-33px] md:left-1/2 top-8 w-4 h-4 rounded-full bg-[#FF6B35] border-4 border-white shadow-lg transform md:-translate-x-1/2 z-10" />

                        {/* Content */}
                        <div className="flex-1">
                            <Link href={`/actualites/${item.slug}`} className="group block">
                                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group-hover:-translate-y-2">
                                    <div className="relative h-48 overflow-hidden">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-bold text-[#FF6B35]">
                                            {item.category}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(item.createdAt || item.date).toLocaleDateString()}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#FF6B35] transition-colors line-clamp-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                                            {item.excerpt}
                                        </p>
                                        <div className="flex items-center text-[#FF6B35] font-semibold text-sm group-hover:gap-2 transition-all">
                                            Lire l'article <ArrowRight className="w-4 h-4 ml-1" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {/* Empty Space for Grid alignment */}
                        <div className="flex-1 hidden md:block" />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
