const mongoose = require('mongoose');

const showroomSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User', unique: true },
    nom: { type: String, required: true },
    description: { type: String },
    ville: { type: String, required: true },
    adresse: { type: String },
    telephone: { type: String, required: true },
    email: { type: String },
    logo: { type: String },
    coverImage: { type: String },
    horaires: { type: String },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    location: {
        lat: { type: Number },
        lng: { type: Number },
        address: { type: String },
        googleMapLink: { type: String } // Embed URL or Google Maps Link
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Showroom', showroomSchema);
