const asyncHandler = require('express-async-handler');
const News = require('../models/newsModel');

// @desc    Get all news articles
// @route   GET /api/news
// @access  Public
const getNews = asyncHandler(async (req, res) => {
    const pageSize = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;

    const filters = {};
    if (req.query.category) {
        filters.category = req.query.category;
    }

    const count = await News.countDocuments(filters);
    const news = await News.find(filters)
        .sort({ createdAt: -1 })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({
        news,
        page,
        pages: Math.ceil(count / pageSize),
        total: count
    });
});


// @desc    Get single news by ID
// @route   GET /api/news/id/:id
// @access  Public
const getNewsById = asyncHandler(async (req, res) => {
    const article = await News.findById(req.params.id);
    if (article) {
        res.json(article);
    } else {
        res.status(404);
        throw new Error('Article non trouvé');
    }
});

// @desc    Get single news by slug
// @route   GET /api/news/slug/:slug
// @access  Public
const getNewsBySlug = asyncHandler(async (req, res) => {
    const article = await News.findOne({ slug: req.params.slug });

    if (article) {
        // Increment views
        article.views += 1;
        await article.save();
        res.json(article);
    } else {
        res.status(404);
        throw new Error('Article non trouvé');
    }
});

// @desc    Create news article
// @route   POST /api/news
// @access  Private/Admin
const createNews = asyncHandler(async (req, res) => {
    const { title, excerpt, content, image, category } = req.body;

    // Generate slug from title
    const slug = title.toLowerCase()
        .replace(/[àáâãäå]/g, 'a')
        .replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i')
        .replace(/[òóôõö]/g, 'o')
        .replace(/[ùúûü]/g, 'u')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const news = await News.create({
        title,
        slug,
        excerpt,
        content,
        image,
        category,
        author: req.user._id
    });

    res.status(201).json(news);
});


// @desc    Update news article
// @route   PUT /api/news/:id
// @access  Private/Admin
const updateNews = asyncHandler(async (req, res) => {
    const article = await News.findById(req.params.id);

    if (article) {
        article.title = req.body.title || article.title;
        article.excerpt = req.body.excerpt || article.excerpt;
        article.content = req.body.content || article.content;
        article.image = req.body.image || article.image;
        article.category = req.body.category || article.category;

        const updatedArticle = await article.save();
        res.json(updatedArticle);
    } else {
        res.status(404);
        throw new Error('Article non trouvé');
    }
});

// @desc    Delete news article
// @route   DELETE /api/news/:id
// @access  Private/Admin
const deleteNews = asyncHandler(async (req, res) => {
    const article = await News.findById(req.params.id);

    if (article) {
        await article.deleteOne();
        res.json({ message: 'Article supprimé' });
    } else {
        res.status(404);
        throw new Error('Article non trouvé');
    }
});

module.exports = { getNews, getNewsBySlug, getNewsById, createNews, updateNews, deleteNews };
