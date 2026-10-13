
const mongoose = require('mongoose');

const connectDB = async () => {
    const mongoUri =
        process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!mongoUri) {
        throw new Error(
            'MongoDB URI missing. Check MONGODB_URI in Render Environment.'
        );
    }

    try {
        const conn = await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 10000,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        throw error;
    }
};

module.exports = connectDB;
