import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MadjidAuto - Prix des Voitures Neuves et Occasions en Algérie",
  description: "Trouvez la voiture qui vous correspond. Découvrez les prix des voitures neuves, occasions, concessionnaires et actualités automobiles en Algérie.",
  keywords: "voitures algérie, prix voitures, occasions, concessionnaires, auto algérie",
  openGraph: {
    title: "MadjidAuto - Votre Référence Auto en Algérie",
    description: "Trouvez la voiture qui vous correspond parmi notre sélection de véhicules neufs et d'occasion.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Roboto:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
