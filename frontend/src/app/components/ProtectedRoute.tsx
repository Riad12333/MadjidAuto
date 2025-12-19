"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: 'ADMIN' | 'SHOWROOM' | 'USER';
}

export default function ProtectedRoute({ children, requiredRole = 'ADMIN' }: ProtectedRouteProps) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            try {
                const token = localStorage.getItem('token');
                const userData = localStorage.getItem('user');

                // Pas de token ou de données utilisateur
                if (!token || !userData) {
                    router.push('/connexion');
                    return;
                }

                const user = JSON.parse(userData);

                // Vérifier le rôle
                if (requiredRole && user.role !== requiredRole) {
                    // Si l'utilisateur n'a pas le bon rôle, rediriger vers la page d'accueil
                    router.push('/');
                    return;
                }

                // Tout est OK
                setIsAuthorized(true);
            } catch (error) {
                console.error('Erreur de vérification auth:', error);
                router.push('/connexion');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [router, requiredRole]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#FF6B35] mx-auto mb-4"></div>
                    <p className="text-white text-lg">Vérification des autorisations...</p>
                </div>
            </div>
        );
    }

    if (!isAuthorized) {
        return null;
    }

    return <>{children}</>;
}
