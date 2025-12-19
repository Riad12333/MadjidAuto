const mongoose = require('mongoose');

const carSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    marque: { type: String, required: true, index: true },
    modele: { type: String, required: true, index: true },
    version: { type: String },
    prix: { type: Number, required: true, index: true },
    annee: { type: Number, required: true, index: true },
    km: { type: Number, required: true, index: true },
    carburant: { type: String, required: true }, // Essence, Diesel, GPL, Hybride, Electrique
    boite: { type: String, required: true }, // Manuelle, Automatique
    couleur: { type: String },
    ville: { type: String, required: true },
    images: [{ type: String }], // URLs from Cloudinary/Local
    description: { type: String },
    contactPhone: { type: String },
    specifications: {
        moteur: String,
        puissance: String,
        options: [String] // Clim, ABS, Toit ouvrant...
    },
    status: { type: String, enum: ['DISPONIBLE', 'VENDU', 'RESERVE'], default: 'DISPONIBLE' },
    isNew: { type: Boolean, default: false } // Nouvelle (true) ou Occasion (false)
}, {
    timestamps: true
});

// Create compound index for search
carSchema.index({ marque: 'text', modele: 'text', description: 'text' });

module.exports = mongoose.model('Car', carSchema);
