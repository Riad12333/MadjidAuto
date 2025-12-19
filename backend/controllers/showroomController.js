const asyncHandler = require('express-async-handler');
const Showroom = require('../models/showroomModel');
const Car = require('../models/carModel');
const User = require('../models/userModel');

// @desc    Get all showrooms
// @route   GET /api/showrooms
// @access  Public
const getShowrooms = asyncHandler(async (req, res) => {
    const filters = {};
    if (req.query.ville) {
        filters.ville = { $regex: req.query.ville, $options: 'i' };
    }

    const showrooms = await Showroom.find(filters)
        .populate('user', 'nom prenom coverImage logo') // Fetch user's coverImage
        .sort({ rating: -1 });

    // Add car count for each showroom and ensure coverImage is taken from user if present
    const showroomsWithCount = await Promise.all(showrooms.map(async (showroom) => {
        const carCount = await Car.countDocuments({ user: showroom.user._id });
        const showroomObj = showroom.toObject();

        // Use User's coverImage/logo if Showroom's is empty or to be safe (User requested source of truth from User table)
        if (showroom.user && showroom.user.coverImage) showroomObj.coverImage = showroom.user.coverImage;
        if (showroom.user && showroom.user.logo) showroomObj.logo = showroom.user.logo;

        return {
            ...showroomObj,
            carsCount: carCount
        };
    }));

    res.json(showroomsWithCount);
});

// @desc    Get single showroom
// @route   GET /api/showrooms/:id
// @access  Public
const getShowroomById = asyncHandler(async (req, res) => {
    const showroom = await Showroom.findById(req.params.id).populate('user', 'nom prenom coverImage logo');

    if (showroom) {
        const cars = await Car.find({ user: showroom.user._id }).limit(20);
        const showroomObj = showroom.toObject();

        // Use User's coverImage/logo if Showroom's is empty
        if (showroom.user && showroom.user.coverImage) showroomObj.coverImage = showroom.user.coverImage;
        if (showroom.user && showroom.user.logo) showroomObj.logo = showroom.user.logo;

        res.json({
            ...showroomObj,
            cars
        });
    } else {
        res.status(404);
        throw new Error('Concessionnaire non trouvé');
    }
});

// @desc    Create showroom (for showroom accounts)
// @route   POST /api/showrooms
// @access  Private
const createShowroom = asyncHandler(async (req, res) => {
    const existingShowroom = await Showroom.findOne({ user: req.user._id });
    if (existingShowroom) {
        res.status(400);
        throw new Error('Vous avez déjà un showroom');
    }

    const { nom, description, ville, adresse, telephone, email, logo, horaires, location } = req.body;

    const showroom = await Showroom.create({
        user: req.user._id,
        nom,
        description,
        ville,
        adresse,
        telephone,
        email,
        logo,
        horaires,
        location
    });

    // Update user info & role safely
    const userUpdate = {
        nom: nom || req.user.nom,
        phone: telephone || req.user.phone,
        ville: ville || req.user.ville,
        description: description || req.user.description,
        adresse: adresse || req.user.adresse,
        logo: logo || req.user.logo,
        horaires: horaires || req.user.horaires,
        googleMapLink: (location && location.googleMapLink) || req.user.googleMapLink
    };

    // Only upgrade to SHOWROOM if user is a normal USER (don't downgrade ADMINs)
    if (req.user.role === 'USER') {
        userUpdate.role = 'SHOWROOM';
    }

    await User.findByIdAndUpdate(req.user._id, userUpdate);

    res.status(201).json(showroom);
});

// @desc    Update showroom
// @route   PUT /api/showrooms
// @access  Private (Showroom owner)
const updateShowroom = asyncHandler(async (req, res) => {
    const showroom = await Showroom.findOne({ user: req.user._id });

    if (showroom) {
        console.log(`Updating showroom for user ${req.user._id}...`);

        showroom.nom = req.body.nom || showroom.nom;
        showroom.description = req.body.description || showroom.description;
        showroom.ville = req.body.ville || showroom.ville;
        showroom.adresse = req.body.adresse || showroom.adresse;
        showroom.telephone = req.body.telephone || showroom.telephone;
        showroom.email = req.body.email || showroom.email;
        showroom.logo = req.body.logo || showroom.logo;
        showroom.coverImage = req.body.coverImage || showroom.coverImage;
        showroom.horaires = req.body.horaires || showroom.horaires;
        if (req.body.location) {
            if (!showroom.location) showroom.location = {};
            if (req.body.location.googleMapLink !== undefined) showroom.location.googleMapLink = req.body.location.googleMapLink;
            if (req.body.location.lat !== undefined) showroom.location.lat = req.body.location.lat;
            if (req.body.location.lng !== undefined) showroom.location.lng = req.body.location.lng;
            if (req.body.location.address !== undefined) showroom.location.address = req.body.location.address;
        }

        const updatedShowroom = await showroom.save();

        // Sync with User model
        const userUpdate = {
            nom: updatedShowroom.nom,
            phone: updatedShowroom.telephone,
            ville: updatedShowroom.ville,
            description: updatedShowroom.description,
            adresse: updatedShowroom.adresse,
            logo: updatedShowroom.logo,
            coverImage: updatedShowroom.coverImage,
            horaires: updatedShowroom.horaires,
            googleMapLink: updatedShowroom.location ? updatedShowroom.location.googleMapLink : undefined
        };

        console.log('Syncing to User table:', userUpdate);
        await User.findByIdAndUpdate(req.user._id, userUpdate);

        res.json(updatedShowroom);
    } else {
        res.status(404);
        throw new Error('Showroom non trouvé');
    }
});

// @desc    Get current user showroom
// @route   GET /api/showrooms/mine
// @access  Private
const getMyShowroom = asyncHandler(async (req, res) => {
    const showroom = await Showroom.findOne({ user: req.user._id });

    if (showroom) {
        res.json(showroom);
    } else {
        res.status(404);
        throw new Error('Showroom non trouvé');
    }
});


// @desc    Delete showroom (Admin)
// @route   DELETE /api/showrooms/:id
// @access  Private/Admin
const deleteShowroom = asyncHandler(async (req, res) => {
    const showroom = await Showroom.findById(req.params.id);

    if (showroom) {
        // Find owner and revert role if needed? Or just delete showroom.
        // Optional: await User.findByIdAndUpdate(showroom.user, { role: 'USER' });
        await showroom.deleteOne();
        res.json({ message: 'Showroom supprimé' });
    } else {
        res.status(404);
        throw new Error('Showroom non trouvé');
    }
});

// @desc    Update any showroom (Admin)
// @route   PUT /api/showrooms/:id
// @access  Private/Admin
const updateAnyShowroom = asyncHandler(async (req, res) => {
    const showroom = await Showroom.findById(req.params.id);

    if (showroom) {
        console.log(`Admin updating showroom ${req.params.id}...`);

        Object.assign(showroom, req.body);
        const updatedShowroom = await showroom.save();

        // Sync with User
        const userUpdate = {};
        if (req.body.nom !== undefined) userUpdate.nom = req.body.nom;
        if (req.body.telephone !== undefined) userUpdate.phone = req.body.telephone;
        if (req.body.ville !== undefined) userUpdate.ville = req.body.ville;
        if (req.body.description !== undefined) userUpdate.description = req.body.description;
        if (req.body.adresse !== undefined) userUpdate.adresse = req.body.adresse;
        if (req.body.logo !== undefined) userUpdate.logo = req.body.logo;
        if (req.body.coverImage !== undefined) userUpdate.coverImage = req.body.coverImage;
        if (req.body.horaires !== undefined) userUpdate.horaires = req.body.horaires;
        if (req.body.location && req.body.location.googleMapLink !== undefined) {
            userUpdate.googleMapLink = req.body.location.googleMapLink;
        }

        if (Object.keys(userUpdate).length > 0) {
            console.log(`Syncing to User table for owner ${showroom.user}:`, userUpdate);
            await User.findByIdAndUpdate(showroom.user, userUpdate);
        }

        res.json(updatedShowroom);
    } else {
        res.status(404);
        throw new Error('Showroom non trouvé');
    }
});

module.exports = {
    getShowrooms,
    getShowroomById,
    createShowroom,
    updateShowroom,
    getMyShowroom,
    deleteShowroom,
    updateAnyShowroom
};
