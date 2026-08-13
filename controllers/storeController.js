const StoreCategory = require('../models/StoreCategory');
const StoreProduct = require('../models/StoreProduct');
const StoreCoupon = require('../models/StoreCoupon');
const StoreOrder = require('../models/StoreOrder');
const { getSocketIO } = require('../config/socket');

// ==========================================
// CATEGORIES CONTROLLER
// ==========================================
exports.getCategories = async (req, res) => {
  try {
    const categories = await StoreCategory.find({ isActive: true }).sort({ displayOrder: 1, createdAt: 1 });
    res.json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllCategoriesAdmin = async (req, res) => {
  try {
    const categories = await StoreCategory.find().sort({ displayOrder: 1, createdAt: -1 });
    res.json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, subtitle, badgeTag, imageUrl, slug, displayOrder } = req.body;
    const catSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const category = await StoreCategory.create({
      name,
      subtitle,
      badgeTag,
      imageUrl,
      slug: catSlug,
      displayOrder: displayOrder || 0
    });
    const io = getSocketIO();
    if (io) io.emit('store:categories-updated', { action: 'create', data: category });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await StoreCategory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    const io = getSocketIO();
    if (io) io.emit('store:categories-updated', { action: 'update', data: category });
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await StoreCategory.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    const io = getSocketIO();
    if (io) io.emit('store:categories-updated', { action: 'delete', id: req.params.id });
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// PRODUCTS CONTROLLER
// ==========================================
exports.getProducts = async (req, res) => {
  try {
    const { category, search, badge, sort } = req.query;
    let query = { isActive: true };

    if (category) {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const catObj = await StoreCategory.findOne({ slug: category });
        if (catObj) query.category = catObj._id;
      }
    }

    if (badge) {
      query.badgeTag = badge;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { subtitle: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'price_low') sortOptions = { price: 1 };
    if (sort === 'price_high') sortOptions = { price: -1 };
    if (sort === 'popularity') sortOptions = { reviewCount: -1, rating: -1 };

    const products = await StoreProduct.find(query).populate('category', 'name slug badgeTag').sort(sortOptions);
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllProductsAdmin = async (req, res) => {
  try {
    const products = await StoreProduct.find().populate('category', 'name slug').sort({ createdAt: -1 });
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await StoreProduct.findById(req.params.id).populate('category', 'name slug badgeTag');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    let { mrp, price, category } = req.body;
    let discountPercent = req.body.discountPercent;
    if (mrp && price && mrp > price) {
      discountPercent = Math.round(((mrp - price) / mrp) * 100);
    }

    // Resolve or auto-create category if missing/invalid
    let validCategoryId = category;
    if (!validCategoryId || validCategoryId === '' || !validCategoryId.match(/^[0-9a-fA-F]{24}$/)) {
      let existingCat = await StoreCategory.findOne();
      if (!existingCat) {
        existingCat = await StoreCategory.create({
          name: "Men's Wear",
          subtitle: "Tees, Shorts & Tanks",
          slug: "mens-wear",
          badgeTag: "HOT"
        });
      }
      validCategoryId = existingCat._id;
    }

    const product = await StoreProduct.create({
      ...req.body,
      category: validCategoryId,
      discountPercent
    });
    const io = getSocketIO();
    if (io) io.emit('store:catalog-updated', { action: 'create', data: product });
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error('createProduct Error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    if (req.body.mrp && req.body.price && req.body.mrp > req.body.price) {
      req.body.discountPercent = Math.round(((req.body.mrp - req.body.price) / req.body.mrp) * 100);
    }

    let updateData = { ...req.body };
    if (!updateData.category || updateData.category === '' || !updateData.category.match(/^[0-9a-fA-F]{24}$/)) {
      delete updateData.category;
    }

    const product = await StoreProduct.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true }).populate('category', 'name slug');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    const io = getSocketIO();
    if (io) io.emit('store:catalog-updated', { action: 'update', data: product });
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await StoreProduct.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    const io = getSocketIO();
    if (io) io.emit('store:catalog-updated', { action: 'delete', id: req.params.id });
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addProductReview = async (req, res) => {
  try {
    const { userName, rating, title, comment } = req.body;
    const product = await StoreProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const newReview = {
      userName: userName || 'Anonymous Yogi',
      isVerifiedBuyer: true,
      date: 'Just now',
      rating: Number(rating) || 5,
      title: title || 'Great Product!',
      comment: comment || 'Very satisfied with this yoga gear.'
    };

    if (!product.reviews) product.reviews = [];
    product.reviews.unshift(newReview);
    product.reviewCount = product.reviews.length;
    
    const totalSum = product.reviews.reduce((acc, r) => acc + r.rating, 0);
    product.rating = Number((totalSum / product.reviews.length).toFixed(1));

    await product.save();
    const io = getSocketIO();
    if (io) io.emit('store:review-added', { productId: product._id, product });
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ==========================================
// COUPONS CONTROLLER
// ==========================================
exports.getCoupons = async (req, res) => {
  try {
    const coupons = await StoreCoupon.find().sort({ createdAt: -1 });
    res.json({ success: true, count: coupons.length, data: coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createCoupon = async (req, res) => {
  try {
    const coupon = await StoreCoupon.create(req.body);
    res.status(201).json({ success: true, data: coupon });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateCoupon = async (req, res) => {
  try {
    const coupon = await StoreCoupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    res.json({ success: true, data: coupon });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await StoreCoupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    res.json({ success: true, message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.validateCoupon = async (req, res) => {
  try {
    const { code, cartAmount } = req.body;
    if (!code) return res.status(400).json({ success: false, message: 'Coupon code is required' });

    const coupon = await StoreCoupon.findOne({ code: code.toUpperCase(), status: 'Active' });
    if (!coupon) return res.status(404).json({ success: false, message: 'Invalid or expired coupon code' });

    if (cartAmount && cartAmount < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of ₹${coupon.minOrderAmount} required for this coupon`
      });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round(((cartAmount || 0) * coupon.discountValue) / 100);
    } else {
      discountAmount = coupon.discountValue;
    }

    res.json({
      success: true,
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
        finalPrice: Math.max(0, (cartAmount || 0) - discountAmount)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// ORDERS CONTROLLER
// ==========================================
exports.createOrder = async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, shippingAddress, items, subtotal, couponCode, discountAmount, totalAmount, paymentMethod } = req.body;
    
    const orderNumber = 'YOGA-' + Math.floor(100000 + Math.random() * 900000);
    const order = await StoreOrder.create({
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      subtotal,
      couponCode,
      discountAmount,
      totalAmount,
      paymentMethod: paymentMethod || 'UPI',
      paymentStatus: 'Paid',
      orderStatus: 'Placed'
    });

    const io = getSocketIO();
    if (io) {
      io.emit('store:new-order', order);
      io.emit('store:order-status-changed', order);
    }

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await StoreOrder.find().sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await StoreOrder.findByIdAndUpdate(
      req.params.id,
      { ...(orderStatus && { orderStatus }), ...(paymentStatus && { paymentStatus }) },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    const io = getSocketIO();
    if (io) io.emit('store:order-status-changed', order);
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.trackOrder = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const order = await StoreOrder.findOne({ orderNumber: orderNumber.toUpperCase() });
    if (!order) return res.status(404).json({ success: false, message: 'Order number not found' });
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.checkPincode = async (req, res) => {
  try {
    const { pincode } = req.body;
    if (!pincode || pincode.length < 6) {
      return res.status(400).json({ success: false, message: 'Invalid 6-digit Pincode' });
    }
    res.json({
      success: true,
      data: {
        pincode,
        isServiceable: true,
        deliveryDays: 1,
        deliveryDate: 'Tomorrow',
        isCodAvailable: true,
        expressDelivery: true
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
