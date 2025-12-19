const express = require('express');
const router = express.Router();

const { getNews, getNewsBySlug, getNewsById, createNews, updateNews, deleteNews } = require('../controllers/newsController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getNews)
    .post(protect, admin, createNews);

router.route('/:id')
    .put(protect, admin, updateNews)
    .delete(protect, admin, deleteNews);

router.get('/slug/:slug', getNewsBySlug);
router.get('/id/:id', getNewsById);

module.exports = router;
