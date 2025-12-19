const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });

const User = require('./models/userModel');
const Car = require('./models/carModel');
const News = require('./models/newsModel');
const Showroom = require('./models/showroomModel');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/madjidauto');
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

const carData = {
    marques: [
        { name: 'Renault', models: ['Clio', 'Symbol', 'Megane', 'Duster', 'Stepway', 'Kwid', 'Captur', 'Arkana', 'Koleos', 'Talisman'] },
        { name: 'Hyundai', models: ['Tucson', 'Accent', 'Elantra', 'i10', 'i20', 'i30', 'Creta', 'Santa Fe', 'Kona', 'Staria'] },
        { name: 'Peugeot', models: ['208', '308', '2008', '3008', '5008', 'Partner', 'Rifter', '508', 'Traveller', 'Expert'] },
        { name: 'Kia', models: ['Picanto', 'Rio', 'Sportage', 'Sorento', 'Cerato', 'K5', 'Sonet', 'Seltos', 'Carnival', 'Stinger'] },
        { name: 'Volkswagen', models: ['Golf', 'Polo', 'Tiguan', 'Passat', 'Caddy', 'Touareg', 'T-Roc', 'Arteon', 'Amarok', 'ID.4'] },
        { name: 'Toyota', models: ['Yaris', 'Corolla', 'Camry', 'RAV4', 'Land Cruiser', 'Hilux', 'Fortuner', 'C-HR'] },
        { name: 'Fiat', models: ['500', 'Panda', 'Tipo', 'Doblo', 'Punto'] },
        { name: 'Dacia', models: ['Logan', 'Sandero', 'Duster', 'Spring', 'Jogger'] }
    ],
    villes: ['Alger', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Sétif', 'Batna', 'Tlemcen', 'Béjaïa', 'Tizi Ouzou'],
    carburants: ['Essence', 'Diesel', 'GPL', 'Hybride', 'Electrique'],
    boites: ['Manuelle', 'Automatique'],
    couleurs: ['Noir', 'Blanc', 'Gris', 'Rouge', 'Bleu', 'Argent', 'Beige']
};

const newsData = [
    { title: 'Nouveau Renault Duster 2025 disponible en Algérie', excerpt: 'Le nouveau Duster arrive avec un design révolutionnaire.', category: 'Nouveautés', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800' },
    { title: 'Tarifs Hyundai Tucson révisés pour 2025', excerpt: 'Hyundai Algérie annonce de nouveaux tarifs compétitifs.', category: 'Prix', image: 'https://images.unsplash.com/photo-1622186477895-f2af6a0f5a97?w=800' },
    { title: 'FIAT lance la Grande Panda fabriquée à Oran', excerpt: 'Premier véhicule 100% assemblé en Algérie.', category: 'Industrie', image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800' },
    { title: 'Importation véhicules moins de 3 ans : Nouvelles conditions', excerpt: 'Le ministère publie les nouvelles modalités.', category: 'Réglementation', image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800' },
    { title: 'Toyota Yaris 2026 : Caractéristiques et prix', excerpt: 'La nouvelle Toyota Yaris débarque avec des technologies avancées.', category: 'Nouveautés', image: 'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800' },
    { title: 'Projet usine Hyundai en Algérie confirmé', excerpt: 'Le projet d\'usine Hyundai en partenariat avec Bahwan avance.', category: 'Industrie', image: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=800' }
];

const showroomData = [
    { nom: 'Renault Alger Centre', ville: 'Alger', adresse: '123 Avenue de l\'Indépendance', telephone: '021 XX XX XX', rating: 4.8 },
    { nom: 'Hyundai Oran', ville: 'Oran', adresse: '45 Boulevard Front de Mer', telephone: '041 XX XX XX', rating: 4.6 },
    { nom: 'Peugeot Constantine', ville: 'Constantine', adresse: '78 Rue Didouche Mourad', telephone: '031 XX XX XX', rating: 4.7 },
    { nom: 'KIA Motors Annaba', ville: 'Annaba', adresse: '12 Route Nationale', telephone: '038 XX XX XX', rating: 4.5 },
    { nom: 'Toyota Blida', ville: 'Blida', adresse: '56 Avenue de la Liberté', telephone: '025 XX XX XX', rating: 4.9 }
];

const seedDatabase = async () => {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Car.deleteMany();
    await News.deleteMany();
    await Showroom.deleteMany();

    console.log('🗑️  Anciennes données supprimées');

    // Create Admin User
    const adminUser = await User.create({
        nom: 'Admin',
        prenom: 'DzairAuto',
        email: 'admin@dzairauto.com',
        password: 'Admin123!',
        phone: '0550000000',
        ville: 'Alger',
        role: 'ADMIN'
    });
    console.log('👤 Admin créé: admin@dzairauto.com / Admin123!');

    // Create Showroom Users and Showrooms
    const showroomUsers = [];
    for (let i = 0; i < showroomData.length; i++) {
        const data = showroomData[i];
        const logoUrl = `https://via.placeholder.com/150?text=${data.nom.split(' ')[0]}`;
        const desc = `Bienvenue chez ${data.nom}, votre partenaire de confiance.`;

        const user = await User.create({
            nom: data.nom.split(' ')[0],
            prenom: 'Manager',
            email: `showroom${i + 1}@dzairauto.com`,
            password: 'Showroom123!',
            phone: `055000000${i + 1}`,
            ville: data.ville,
            role: 'SHOWROOM',
            adresse: data.adresse,
            logo: logoUrl,
            description: desc,
            horaires: "Dim-Jeu: 08:00 - 17:00"
        });
        showroomUsers.push(user);

        await Showroom.create({
            user: user._id,
            nom: data.nom,
            ville: data.ville,
            adresse: data.adresse,
            telephone: data.telephone,
            email: `showroom${i + 1}@dzairauto.com`,
            logo: logoUrl,
            description: desc,
            horaires: "Dim-Jeu: 08:00 - 17:00",
            rating: data.rating
        });
    }
    console.log(`🏪 ${showroomData.length} Showrooms créés`);

    // Create Cars (100+ cars)
    let carCount = 0;
    for (const marque of carData.marques) {
        for (const modele of marque.models) {
            const randomUser = showroomUsers[Math.floor(Math.random() * showroomUsers.length)];
            const isNew = Math.random() > 0.7;

            await Car.create({
                user: randomUser._id,
                marque: marque.name,
                modele: modele,
                version: ['Standard', 'Sport', 'Luxury', 'GT'][Math.floor(Math.random() * 4)],
                prix: Math.floor(Math.random() * 8000000) + 2000000,
                annee: isNew ? 2024 : Math.floor(Math.random() * 5) + 2020,
                km: isNew ? Math.floor(Math.random() * 1000) : Math.floor(Math.random() * 150000),
                carburant: carData.carburants[Math.floor(Math.random() * carData.carburants.length)],
                boite: carData.boites[Math.floor(Math.random() * carData.boites.length)],
                couleur: carData.couleurs[Math.floor(Math.random() * carData.couleurs.length)],
                ville: carData.villes[Math.floor(Math.random() * carData.villes.length)],
                images: [`https://images.unsplash.com/photo-${1550000000000 + Math.floor(Math.random() * 100000000)}?w=800&auto=format`],
                description: `${marque.name} ${modele} en excellent état. ${isNew ? 'Véhicule neuf avec garantie constructeur.' : 'Véhicule d\'occasion bien entretenu.'}`,
                contactPhone: randomUser.phone,
                isNew: isNew
            });
            carCount++;
        }
    }
    console.log(`🚗 ${carCount} véhicules créés`);

    // Create News
    for (const article of newsData) {
        const slug = article.title.toLowerCase()
            .replace(/[àáâãäå]/g, 'a')
            .replace(/[èéêë]/g, 'e')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        await News.create({
            title: article.title,
            slug: slug,
            excerpt: article.excerpt,
            content: `${article.excerpt} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
            image: article.image,
            category: article.category,
            author: adminUser._id,
            views: Math.floor(Math.random() * 1000)
        });
    }
    console.log(`📰 ${newsData.length} articles créés`);

    console.log('\n✅ Base de données initialisée avec succès !');
    console.log('==========================================');
    console.log('🔑 Compte Admin: admin@dzairauto.com / Admin123!');
    console.log('🔑 Comptes Showroom: showroom1@dzairauto.com à showroom5@dzairauto.com / Showroom123!');
    console.log('==========================================');

    process.exit();
};

seedDatabase();
