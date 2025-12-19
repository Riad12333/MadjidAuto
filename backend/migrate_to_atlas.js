const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config({ path: '../.env' });

// Importer les modèles
const User = require('./models/userModel');
const Car = require('./models/carModel');
const News = require('./models/newsModel');
const Showroom = require('./models/showroomModel');

const LOCAL_URI = 'mongodb://localhost:27017/madjidauto';
const ATLAS_URI = process.env.MONGO_URI || "mongodb+srv://madjidouldgougam_db_user:portfolioalgoedit1239@cluster0.ibetfyi.mongodb.net/madjidauto?appName=Cluster0";

async function migrate() {
    try {
        console.log('🔌 Connexion au MongoDB local...');
        const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
        console.log('✅ Connecté au local');

        console.log('🔌 Connexion à MongoDB Atlas...');
        const atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();
        console.log('✅ Connecté à Atlas');

        // Collections à migrer
        const collections = [
            { name: 'Users', model: User, modelName: 'User' },
            { name: 'Cars', model: Car, modelName: 'Car' },
            { name: 'News', model: News, modelName: 'News' },
            { name: 'Showrooms', model: Showroom, modelName: 'Showroom' }
        ];

        for (const col of collections) {
            console.log(`\n📦 Migration de la collection : ${col.name}...`);

            // Récupérer les données locales
            const LocalModel = localConn.model(col.modelName, col.model.schema);
            const data = await LocalModel.find({});
            console.log(`🔍 ${data.length} documents trouvés en local.`);

            if (data.length > 0) {
                // Insérer dans Atlas
                const AtlasModel = atlasConn.model(col.modelName, col.model.schema);

                // Optionnel : Vider la collection Atlas avant (décommenter si nécessaire)
                // await AtlasModel.deleteMany({});

                await AtlasModel.insertMany(data);
                console.log(`🚀 ${data.length} documents copiés vers Atlas !`);
            }
        }

        console.log('\n✨ Migration terminée avec succès !');
        process.exit(0);

    } catch (error) {
        console.error('❌ Erreur pendant la migration :', error);
        process.exit(1);
    }
}

migrate();
