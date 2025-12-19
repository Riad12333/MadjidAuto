import type { Metadata } from "next";
import "./globals.css";
import { Montserrat, Roboto } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
});

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
    <html lang="fr" className={`${montserrat.variable} ${roboto.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
