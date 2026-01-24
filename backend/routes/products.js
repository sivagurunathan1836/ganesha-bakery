const express = require('express');
const router = express.Router();
const {
    getAllProducts,
    getProductById,
    getProductsByCategory,
    createProduct,
    updateProduct,
    updateStock,
    deleteProduct,
    getFeaturedProducts
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProductById);
router.get('/category/:categoryId', getProductsByCategory);
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.patch('/:id/stock', protect, admin, updateStock);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
