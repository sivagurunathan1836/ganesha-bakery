const express = require('express');
const router = express.Router();
const {
    createOrder,
    getOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
    cancelOrder
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.use(protect); // All order routes require authentication

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/admin/all', admin, getAllOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', admin, updateOrderStatus);
router.put('/:id/cancel', cancelOrder);

module.exports = router;
