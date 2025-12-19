"use client";

import { useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface PublishButtonProps {
    className?: string;
    children: React.ReactNode;
}

export default function PublishButton({ className, children }: PublishButtonProps) {
    const router = useRouter();

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();

        // Check for token in localStorage (Client-side only)
        const token = localStorage.getItem('token');

        if (token) {
            // Logged in -> Go to Profile with add tab
            router.push('/profil?tab=add');
        } else {
            // Not logged in -> Go to Login
            router.push('/connexion');
        }
    };

    return (
        <a href="/publier-annonce" onClick={handleClick} className={className}>
            {children}
        </a>
    );
}
