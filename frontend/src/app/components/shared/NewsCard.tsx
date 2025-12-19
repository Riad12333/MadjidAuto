import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight, Tag } from "lucide-react";
import type { NewsArticle } from "@/lib/data";
import { CATEGORY_COLORS } from "@/lib/data";

interface NewsCardProps {
    article: NewsArticle;
    featured?: boolean;
}

export default function NewsCard({ article, featured = false }: NewsCardProps) {
    if (featured) {
        return (
            <Link
                href={`/actualites/${article.slug}`}
                className="group block relative rounded-2xl overflow-hidden shadow-xl"
            >
                <div className="relative h-80">
                    <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    <div className={`absolute top-4 left-4 px-3 py-1 ${CATEGORY_COLORS[article.category]} text-white text-sm font-medium rounded-full`}>
                        {article.category}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="flex items-center gap-2 text-gray-300 text-sm mb-2">
                            <Calendar className="w-4 h-4" />
                            {article.date}
                        </div>
                        <h3 className="text-2xl font-bold text-white group-hover:text-[#D32F2F] transition-colors">
                            {article.title}
                        </h3>
                        <p className="text-gray-300 mt-2">{article.excerpt}</p>
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link
            href={`/actualites/${article.slug}`}
            className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 border border-gray-100"
        >
            <div className="relative h-44 overflow-hidden">
                <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className={`absolute top-3 left-3 px-2 py-1 ${CATEGORY_COLORS[article.category] || "bg-gray-500"} text-white text-xs font-bold rounded flex items-center gap-1`}>
                    <Tag className="w-3 h-3" />
                    {article.category}
                </div>
            </div>

            <div className="p-4">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                    <Calendar className="w-4 h-4" />
                    {article.date}
                </div>

                <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-[#D32F2F] transition-colors mb-2">
                    {article.title}
                </h3>

                <p className="text-gray-600 text-sm line-clamp-2 mb-3">{article.excerpt}</p>

                <span className="inline-flex items-center gap-1 text-[#D32F2F] font-medium text-sm group-hover:underline">
                    Lire l'article <ArrowRight className="w-4 h-4" />
                </span>
            </div>
        </Link>
    );
}
