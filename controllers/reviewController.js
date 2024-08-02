const Review = require('../models/Review');
const Product = require('../models/Product');
const User = require('../models/User');

// Create a new review
exports.createReview = async (req, res) => {
  const { productId, reviewText, rating } = req.body;
  const userId = req.user.id; // Assuming the user is authenticated

  try {
    // Check if the product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Create the review
    const newReview = await Review.create({
      productId,
      userId,
      reviewText,
      rating,
    });

    res.status(201).json({ message: 'Review created successfully', review: newReview });
  } catch (err) {
    res.status(500).json({ error: 'Error creating review' });
  }
};

// Get all reviews for a product
exports.getReviewsByProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const reviews = await Review.findAll({ where: { productId }, include: [User] });
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching reviews' });
  }
};

// Get a single review by ID
exports.getReviewById = async (req, res) => {
  const { id } = req.params;

  try {
    const review = await Review.findByPk(id, { include: [User, Product] });
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.status(200).json(review);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching review' });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  const { id } = req.params;
  const { reviewText, rating } = req.body;
  const userId = req.user.id; // Assuming the user is authenticated

  try {
    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Check if the user is the owner of the review
    if (review.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    review.reviewText = reviewText || review.reviewText;
    review.rating = rating || review.rating;

    await review.save();
    res.status(200).json({ message: 'Review updated successfully', review });
  } catch (err) {
    res.status(500).json({ error: 'Error updating review' });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // Assuming the user is authenticated

  try {
    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Check if the user is the owner of the review
    if (review.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await review.destroy();
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting review' });
  }
};
