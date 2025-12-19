const express = require('express');
const router = express.Router();
const {
    getShowrooms,
    getShowroomById,
    createShowroom,
    updateShowroom,
    getMyShowroom,
    deleteShowroom,
    updateAnyShowroom
} = require('../controllers/showroomController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getShowrooms)
    .post(protect, createShowroom)
    .put(protect, updateShowroom);

router.get('/mine', protect, getMyShowroom);

router.route('/:id')
    .get(getShowroomById)
    .put(protect, admin, updateAnyShowroom)
    .delete(protect, admin, deleteShowroom);

module.exports = router;
