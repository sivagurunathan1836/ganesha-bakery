const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a product name'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Please provide a price'],
        min: 0
    },
    priceUnit: {
        type: String,
        enum: ['piece', 'kg'],
        default: 'piece'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    subcategory: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        default: ''
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Virtual for checking if in stock
productSchema.virtual('inStock').get(function () {
    return this.stock > 0 && this.isAvailable;
});

// Ensure virtuals are included in JSON
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
