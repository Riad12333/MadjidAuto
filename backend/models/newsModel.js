const mongoose = require('mongoose');

const newsSchema = mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true }, // Nouveautés, Prix, Industrie, Réglementation
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    views: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('News', newsSchema);
