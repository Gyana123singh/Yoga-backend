const express = require('express');
const router = express.Router();
const { uploadMedia } = require('../middleware/uploadMiddleware');
const {
  getCategories,
  getAllCategoriesAdmin,
  createCategory,
  updateCategory,
  deleteCategory,
  getProducts,
  getAllProductsAdmin,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductReview,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  createOrder,
  getOrders,
  updateOrderStatus,
  trackOrder,
  checkPincode,
  uploadStoreImage
} = require('../controllers/storeController');

// Image Upload Route (Cloudinary / Local Fallback)
router.post('/upload', uploadMedia.single('image'), uploadStoreImage);

// Category Routes
router.get('/categories', getCategories);
router.get('/categories/admin', getAllCategoriesAdmin);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Product Routes
router.get('/products', getProducts);
router.get('/products/admin', getAllProductsAdmin);
router.get('/products/:id', getProductById);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.post('/products/:id/reviews', addProductReview);

// Pincode & Coupon Routes
router.post('/pincode/check', checkPincode);
router.get('/coupons', getCoupons);
router.post('/coupons', createCoupon);
router.put('/coupons/:id', updateCoupon);
router.delete('/coupons/:id', deleteCoupon);
router.post('/coupons/validate', validateCoupon);

// Order Routes
router.post('/orders', createOrder);
router.get('/orders', getOrders);
router.get('/orders/track/:orderNumber', trackOrder);
router.put('/orders/:id/status', updateOrderStatus);

module.exports = router;
