const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Car = require('../models/carModel');

// @desc    Get public statistics (counts)
// @route   GET /api/stats/public
// @access  Public
const getPublicStats = asyncHandler(async (req, res) => {
    const adsCount = await Car.countDocuments({});
    const prosCount = await User.countDocuments({ role: 'SHOWROOM' });

    res.json({
        adsCount,
        prosCount
    });
});

module.exports = {
    getPublicStats
};
