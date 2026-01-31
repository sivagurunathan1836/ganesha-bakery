const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { protect } = require('../middleware/auth');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @route   POST /api/payment/create-order
// @desc    Create Razorpay order
// @access  Private
router.post('/create-order', protect, async (req, res) => {
    try {
        const { amount, currency = 'INR', receipt } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid amount'
            });
        }

        const options = {
            amount: Math.round(amount * 100), // Convert to paise
            currency,
            receipt: receipt || `receipt_${Date.now()}`,
            payment_capture: 1
        };

        const order = await razorpay.orders.create(options);

        res.json({
            success: true,
            order,
            key_id: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        console.error('Razorpay order creation error details:', JSON.stringify(error, null, 2));
        console.error('Error message:', error.message);
        res.status(500).json({
            success: false,
            message: error.error?.description || error.message || 'Failed to create payment order',
            details: error
        });
    }
});

// @route   POST /api/payment/verify
// @desc    Verify payment and create order
// @access  Private
router.post('/verify', protect, async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderData
        } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: 'Missing payment details'
            });
        }

        // Verify signature
        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest('hex');

        if (razorpay_signature !== expectedSign) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment signature'
            });
        }

        // Check if order already exists with this payment ID
        const existingOrder = await Order.findOne({ razorpayPaymentId: razorpay_payment_id });
        if (existingOrder) {
            return res.json({
                success: true,
                order: existingOrder,
                message: 'Order already created'
            });
        }

        // Get cart to calculate order items
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cart is empty'
            });
        }

        // Calculate total from cart
        let totalAmount = 0;
        const orderItems = cart.items.map(item => {
            const itemTotal = item.product.priceUnit === 'kg' && item.weight
                ? item.product.price * item.weight
                : item.product.price * item.quantity;

            totalAmount += itemTotal;

            return {
                product: item.product._id,
                quantity: item.quantity,
                weight: item.weight,
                price: item.product.price
            };
        });

        // Payment verified - Create order
        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            totalAmount,
            shippingAddress: orderData.shippingAddress || {
                name: req.user.name,
                phone: req.user.phone || '',
                street: 'To be updated',
                city: 'To be updated',
                state: 'To be updated',
                pincode: '000000'
            },
            paymentMethod: 'online',
            paymentStatus: 'Paid',
            status: 'pending',
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            paidAt: new Date(),
            notes: orderData.notes || 'Paid via Razorpay UPI'
        });

        // Clear cart
        await Cart.findOneAndUpdate(
            { user: req.user._id },
            { items: [] }
        );

        // Populate order details
        const populatedOrder = await Order.findById(order._id)
            .populate('items.product')
            .populate('user', 'name email');

        res.json({
            success: true,
            order: populatedOrder,
            message: 'Payment verified and order created successfully'
        });
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Payment verification failed'
        });
    }
});

// @route   POST /api/payment/webhook
// @desc    Handle Razorpay webhooks
// @access  Public (but verified)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    try {
        const webhookSignature = req.headers['x-razorpay-signature'];

        if (!webhookSignature) {
            return res.status(400).json({ message: 'Missing signature' });
        }

        // Get raw body for signature verification
        const webhookBody = req.body.toString();

        // Verify webhook signature
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
            .update(webhookBody)
            .digest('hex');

        if (webhookSignature !== expectedSignature) {
            console.error('Invalid webhook signature');
            return res.status(400).json({ message: 'Invalid signature' });
        }

        const event = JSON.parse(webhookBody);
        const eventType = event.event;
        const paymentEntity = event.payload.payment.entity;

        console.log('Webhook received:', eventType);

        // Handle payment captured event
        if (eventType === 'payment.captured') {
            const order = await Order.findOne({
                razorpayOrderId: paymentEntity.order_id
            });

            if (order && order.paymentStatus !== 'Paid') {
                order.paymentStatus = 'Paid';
                order.razorpayPaymentId = paymentEntity.id;
                order.paidAt = new Date();
                await order.save();

                console.log('Order updated via webhook:', order._id);
            }
        }

        // Handle payment failed event
        if (eventType === 'payment.failed') {
            const order = await Order.findOne({
                razorpayOrderId: paymentEntity.order_id
            });

            if (order) {
                order.paymentStatus = 'Failed';
                await order.save();

                console.log('Order marked as failed via webhook:', order._id);
            }
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/payment/key
// @desc    Get Razorpay key ID
// @access  Public
router.get('/key', (req, res) => {
    res.json({
        key_id: process.env.RAZORPAY_KEY_ID
    });
});

module.exports = router;
