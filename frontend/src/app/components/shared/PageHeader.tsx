"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
    icon: LucideIcon;
    badge: string;
    title: string;
    highlight: string;
    description: string;
}

export default function PageHeader({ icon: Icon, badge, title, highlight, description }: PageHeaderProps) {
    return (
        <section className="relative bg-[#1A1A2E] text-white py-24 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-50%] right-[-10%] w-[600px] h-[600px] bg-[#FF6B35] rounded-full blur-[120px] opacity-20" />
                <div className="absolute bottom-[-50%] left-[-10%] w-[600px] h-[600px] bg-[#16213E] rounded-full blur-[120px] opacity-30" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#FF6B35] mb-6"
                >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-bold tracking-wider uppercase">{badge}</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-4xl md:text-6xl font-bold mb-6 font-display"
                >
                    {title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#F7931E]">{highlight}</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed"
                >
                    {description}
                </motion.p>
            </div>
        </section>
    );
}
