"use client";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="fr">
            <body>
                <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-[#F8F9FA]">
                    <h2 className="text-3xl font-bold text-[#1A1A2E] mb-4">Une erreur critique est survenue</h2>
                    <p className="text-gray-600 mb-8 max-w-md">{error.message || "Le site rencontre un problème technique."}</p>
                    <button
                        onClick={() => reset()}
                        className="px-8 py-3 bg-[#FF6B35] text-white rounded-xl font-bold hover:bg-[#E85D2E] transition-all"
                    >
                        Réessayer
                    </button>
                </div>
            </body>
        </html>
    );
}
