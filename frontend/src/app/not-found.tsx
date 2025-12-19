export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
            <h1 className="text-4xl font-bold mb-4">404 - Page Non Trouvée</h1>
            <p className="text-gray-600 mb-8">Désolé, la page que vous recherchez n'existe pas.</p>
            <a
                href="/"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                Retour à l'accueil
            </a>
        </div>
    );
}
