const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { nom, prenom, email, password, phone, ville, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('Cet email est déjà utilisé');
    }

    // Force role to be either USER or SHOWROOM to prevent creating ADMINs publicly
    const userRole = (role === 'SHOWROOM') ? 'SHOWROOM' : 'USER';

    const user = await User.create({
        nom,
        prenom,
        email,
        password,
        phone,
        ville: ville || 'Alger',
        role: userRole
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            nom: user.nom,
            prenom: user.prenom,
            email: user.email,
            role: user.role,
            phone: user.phone,
            ville: user.ville,
            token: generateToken(user._id)
        });
    } else {
        res.status(400);
        throw new Error('Données utilisateur invalides');
    }
});

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            nom: user.nom,
            prenom: user.prenom,
            email: user.email,
            role: user.role,
            phone: user.phone,
            ville: user.ville,
            token: generateToken(user._id)
        });
    } else {
        res.status(401);
        throw new Error('Email ou mot de passe incorrect');
    }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate('favorites');

    if (user) {
        res.json({
            _id: user._id,
            nom: user.nom,
            prenom: user.prenom,
            email: user.email,
            phone: user.phone,
            ville: user.ville,
            role: user.role,
            favorites: user.favorites
        });
    } else {
        res.status(404);
        throw new Error('Utilisateur non trouvé');
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.nom = req.body.nom || user.nom;
        user.prenom = req.body.prenom || user.prenom;
        user.phone = req.body.phone || user.phone;
        user.ville = req.body.ville || user.ville;

        if (req.body.email && req.body.email !== user.email) {
            const userExists = await User.findOne({ email: req.body.email });
            if (userExists) {
                res.status(400);
                throw new Error('Cet email est déjà utilisé');
            }
            user.email = req.body.email;
        }

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            nom: updatedUser.nom,
            prenom: updatedUser.prenom,
            email: updatedUser.email,
            role: updatedUser.role,
            token: generateToken(updatedUser._id)
        });
    } else {
        res.status(404);
        throw new Error('Utilisateur non trouvé');
    }
});

// @desc    Add car to favorites
// @route   POST /api/users/favorites/:carId
// @access  Private
const addFavorite = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const carId = req.params.carId;

    if (!user.favorites.includes(carId)) {
        user.favorites.push(carId);
        await user.save();
    }

    res.json({ message: 'Ajouté aux favoris', favorites: user.favorites });
});

// @desc    Remove car from favorites
// @route   DELETE /api/users/favorites/:carId
// @access  Private
const removeFavorite = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const carId = req.params.carId;

    user.favorites = user.favorites.filter(id => id.toString() !== carId);
    await user.save();

    res.json({ message: 'Retiré des favoris', favorites: user.favorites });
});


// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await user.deleteOne();
        res.json({ message: 'Utilisateur supprimé' });
    } else {
        res.status(404);
        throw new Error('Utilisateur non trouvé');
    }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('Utilisateur non trouvé');
    }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.nom = req.body.nom || user.nom;
        user.prenom = req.body.prenom || user.prenom;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;
        user.phone = req.body.phone || user.phone;
        user.ville = req.body.ville || user.ville;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            nom: updatedUser.nom,
            prenom: updatedUser.prenom,
            email: updatedUser.email,
            role: updatedUser.role,
            phone: updatedUser.phone,
            ville: updatedUser.ville
        });
    } else {
        res.status(404);
        throw new Error('Utilisateur non trouvé');
    }
});

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    addFavorite,
    removeFavorite,
    getUsers,
    deleteUser,
    getUserById,
    updateUser
};
