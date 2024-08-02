const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const {isAuthenticated,isAdmin} = require('../middlewares/authMiddleware');

// Create a new review
router.post('/', isAuthenticated, reviewController.createReview);

// Get all reviews for a product
router.get('/product/:productId', reviewController.getReviewsByProduct);

// Get a single review by ID
router.get('/:id', reviewController.getReviewById);

// Update a review
router.put('/:id', isAuthenticated, reviewController.updateReview);

// Delete a review
router.delete('/:id', isAuthenticated, reviewController.deleteReview);

module.exports = router;
