const asyncHandler = require('express-async-handler');
const Car = require('../models/carModel');

// @desc    Fetch all cars with filters & pagination
// @route   GET /api/cars
// @access  Public
const getCars = asyncHandler(async (req, res) => {
    const pageSize = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;

    // Build filter query
    const filters = {};

    if (req.query.marque) {
        filters.marque = { $regex: req.query.marque, $options: 'i' };
    }
    if (req.query.modele) {
        filters.modele = { $regex: req.query.modele, $options: 'i' };
    }
    if (req.query.ville) {
        filters.ville = { $regex: req.query.ville, $options: 'i' };
    }
    if (req.query.carburant) {
        filters.carburant = req.query.carburant;
    }
    if (req.query.boite) {
        filters.boite = req.query.boite;
    }
    if (req.query.prixMin || req.query.prixMax) {
        filters.prix = {};
        if (req.query.prixMin) filters.prix.$gte = Number(req.query.prixMin);
        if (req.query.prixMax) filters.prix.$lte = Number(req.query.prixMax);
    }
    if (req.query.anneeMin || req.query.anneeMax) {
        filters.annee = {};
        if (req.query.anneeMin) filters.annee.$gte = Number(req.query.anneeMin);
        if (req.query.anneeMax) filters.annee.$lte = Number(req.query.anneeMax);
    }
    if (req.query.kmMax) {
        filters.km = { $lte: Number(req.query.kmMax) };
    }
    if (req.query.isNew !== undefined) {
        filters.isNew = req.query.isNew === 'true';
    }

    // Text search
    if (req.query.q) {
        filters.$text = { $search: req.query.q };
    }

    const count = await Car.countDocuments(filters);
    const cars = await Car.find(filters)
        .populate('user', 'nom prenom phone')
        .sort({ createdAt: -1 })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({
        cars,
        page,
        pages: Math.ceil(count / pageSize),
        total: count
    });
});

// @desc    Fetch single car
// @route   GET /api/cars/:id
// @access  Public
const getCarById = asyncHandler(async (req, res) => {
    const car = await Car.findById(req.params.id).populate('user', 'nom prenom phone ville');

    if (car) {
        res.json(car);
    } else {
        res.status(404);
        throw new Error('Véhicule non trouvé');
    }
});

// @desc    Create a car
// @route   POST /api/cars
// @access  Private
const createCar = asyncHandler(async (req, res) => {
    const {
        marque, modele, version, prix, annee, km, carburant, boite,
        couleur, ville, images, description, contactPhone, specifications, isNew
    } = req.body;

    const car = new Car({
        user: req.user._id,
        marque,
        modele,
        version,
        prix,
        annee,
        km,
        carburant,
        boite,
        couleur,
        ville,
        images: images || [],
        description,
        contactPhone: contactPhone || req.user.phone,
        specifications,
        isNew: isNew || false
    });

    const createdCar = await car.save();
    res.status(201).json(createdCar);
});

// @desc    Update a car
// @route   PUT /api/cars/:id
// @access  Private
const updateCar = asyncHandler(async (req, res) => {
    const car = await Car.findById(req.params.id);

    if (car) {
        // Check ownership
        if (car.user.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
            res.status(401);
            throw new Error('Non autorisé à modifier cette annonce');
        }

        Object.assign(car, req.body);
        const updatedCar = await car.save();
        res.json(updatedCar);
    } else {
        res.status(404);
        throw new Error('Véhicule non trouvé');
    }
});

// @desc    Delete a car
// @route   DELETE /api/cars/:id
// @access  Private
const deleteCar = asyncHandler(async (req, res) => {
    const car = await Car.findById(req.params.id);

    if (car) {
        // Check ownership
        if (car.user.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
            res.status(401);
            throw new Error('Non autorisé à supprimer cette annonce');
        }

        await car.deleteOne();
        res.json({ message: 'Annonce supprimée' });
    } else {
        res.status(404);
        throw new Error('Véhicule non trouvé');
    }
});

// @desc    Get cars by user (My Ads)
// @route   GET /api/cars/myads
// @access  Private
const getMyCars = asyncHandler(async (req, res) => {
    const cars = await Car.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(cars);
});

// @desc    Get car suggestions for autocomplete
// @route   GET /api/cars/suggestions
// @access  Public
const getCarSuggestions = asyncHandler(async (req, res) => {
    const query = req.query.q;
    if (!query) {
        res.json([]);
        return;
    }

    const regex = new RegExp(query, 'i');

    // Search by marque or modele
    const suggestions = await Car.find({
        $or: [
            { marque: { $regex: regex } },
            { modele: { $regex: regex } }
        ]
    })
        .select('marque modele prix images annee _id carburant boite km')
        .sort({ views: -1 }) // Prioritize popular cars
        .limit(5);

    res.json(suggestions);
});

module.exports = { getCars, getCarById, createCar, updateCar, deleteCar, getMyCars, getCarSuggestions };
