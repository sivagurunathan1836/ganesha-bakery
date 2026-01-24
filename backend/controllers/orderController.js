const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Create order from cart
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
    try {
        const { shippingAddress, paymentMethod = 'cod', notes } = req.body;

        // Get user's cart
        const cart = await Cart.findOne({ user: req.user._id })
            .populate('items.product');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Validate stock and prepare order items
        const orderItems = [];
        let totalAmount = 0;

        for (const item of cart.items) {
            const product = await Product.findById(item.product._id);

            if (!product) {
                return res.status(400).json({ message: `Product ${item.product.name} not found` });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for ${product.name}. Available: ${product.stock}`
                });
            }

            let itemPrice;
            if (product.priceUnit === 'kg' && item.weight) {
                itemPrice = product.price * item.weight;
            } else {
                itemPrice = product.price * item.quantity;
            }

            orderItems.push({
                product: product._id,
                name: product.name,
                quantity: item.quantity,
                weight: item.weight,
                price: itemPrice,
                priceUnit: product.priceUnit
            });

            totalAmount += itemPrice;

            // Reduce stock
            product.stock -= item.quantity;
            await product.save();
        }

        // Create order
        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            totalAmount,
            shippingAddress,
            paymentMethod,
            notes
        });

        // Clear cart
        cart.items = [];
        await cart.save();

        res.status(201).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('items.product', 'name image')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.product', 'name image price')
            .populate('user', 'name email');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if order belongs to user or user is admin
        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;

        let query = {};
        if (status) {
            query.status = status;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const orders = await Order.find(query)
            .populate('user', 'name email phone')
            .populate('items.product', 'name image')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(skip);

        const total = await Order.countDocuments(query);

        res.json({
            orders,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            total
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        if (status === 'delivered') {
            order.deliveredAt = Date.now();
        }

        await order.save();

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if order belongs to user
        if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Only allow cancellation of pending orders
        if (order.status !== 'pending') {
            return res.status(400).json({ message: 'Cannot cancel order that is already being processed' });
        }

        // Restore stock
        for (const item of order.items) {
            const product = await Product.findById(item.product);
            if (product) {
                product.stock += item.quantity;
                await product.save();
            }
        }

        order.status = 'cancelled';
        await order.save();

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
