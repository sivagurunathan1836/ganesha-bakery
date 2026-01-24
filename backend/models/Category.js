const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    }
});

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a category name'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        default: ''
    },
    subcategories: [subcategorySchema],
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Category', categorySchema);
