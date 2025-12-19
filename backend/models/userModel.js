const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    ville: { type: String, default: 'Alger' },
    role: { type: String, enum: ['USER', 'ADMIN', 'SHOWROOM'], default: 'USER' },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Car' }],
    // Showroom fields synced for convenience/parity
    description: { type: String },
    adresse: { type: String },
    logo: { type: String },
    coverImage: { type: String },
    horaires: { type: String },
    googleMapLink: { type: String }
}, {
    timestamps: true
});

// Encrypt password before save
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match password method
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
