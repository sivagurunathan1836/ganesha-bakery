const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');

dotenv.config();

const categories = [
    {
        name: 'Biscuits',
        description: 'Delicious baked biscuits and cookies',
        image: '/uploads/categories/biscuits.jpg',
        subcategories: [
            { name: 'Milky Biscuit', description: 'Creamy milk-flavored biscuits' },
            { name: 'Marie Biscuit', description: 'Classic tea-time biscuits' },
            { name: 'Cream Biscuit', description: 'Biscuits with cream filling' },
            { name: 'Chocolate Biscuit', description: 'Rich chocolate biscuits' }
        ]
    },
    {
        name: 'Cakes',
        description: 'Fresh baked cakes for all occasions',
        image: '/uploads/categories/cakes.jpg',
        subcategories: [
            { name: 'Birthday Cake', description: 'Special celebration cakes' },
            { name: 'Pastry', description: 'Individual pastry slices' },
            { name: 'Cup Cake', description: 'Mini decorated cupcakes' },
            { name: 'Chocolate Cake', description: 'Rich chocolate cakes' }
        ]
    },
    {
        name: 'Sweets',
        description: 'Traditional Indian sweets',
        image: '/uploads/categories/sweets.jpg',
        subcategories: [
            { name: 'Laddu', description: 'Round shaped sweets' },
            { name: 'Barfi', description: 'Milk-based fudge sweets' },
            { name: 'Halwa', description: 'Soft pudding sweets' },
            { name: 'Jalebi', description: 'Crispy spiral sweets' }
        ]
    },
    {
        name: 'Breads',
        description: 'Fresh daily breads',
        image: '/uploads/categories/breads.jpg',
        subcategories: [
            { name: 'White Bread', description: 'Classic white bread' },
            { name: 'Brown Bread', description: 'Healthy whole wheat bread' },
            { name: 'Bun', description: 'Soft sweet buns' },
            { name: 'Pav', description: 'Indian dinner rolls' }
        ]
    },
    {
        name: 'Snacks',
        description: 'Savory baked snacks',
        image: '/uploads/categories/snacks.jpg',
        subcategories: [
            { name: 'Puff', description: 'Flaky pastry snacks' },
            { name: 'Samosa', description: 'Crispy stuffed triangles' },
            { name: 'Khari', description: 'Flaky savory biscuits' },
            { name: 'Toast', description: 'Crispy baked toast' }
        ]
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Category.deleteMany({});
        await Product.deleteMany({});

        // Create admin user
        const adminUser = await User.create({
            name: 'Admin',
            email: 'admin@bakery.com',
            password: 'admin123',
            role: 'admin',
            phone: '9876543210'
        });
        console.log('Admin user created: admin@bakery.com / admin123');

        // Create test user
        await User.create({
            name: 'Test User',
            email: 'user@test.com',
            password: 'user123',
            role: 'user',
            phone: '9876543211'
        });
        console.log('Test user created: user@test.com / user123');

        // Create categories
        const createdCategories = await Category.insertMany(categories);
        console.log('Categories created');

        // Create sample products for each category
        const products = [];

        // Biscuits
        const biscuitCategory = createdCategories.find(c => c.name === 'Biscuits');
        products.push(
            { name: 'Premium Milky Biscuit', description: 'Rich milk flavored premium biscuits', price: 45, priceUnit: 'piece', category: biscuitCategory._id, subcategory: 'Milky Biscuit', stock: 50, isFeatured: true },
            { name: 'Classic Marie Gold', description: 'Traditional marie biscuits perfect with tea', price: 30, priceUnit: 'piece', category: biscuitCategory._id, subcategory: 'Marie Biscuit', stock: 100 },
            { name: 'Cream Delight', description: 'Creamy vanilla filled biscuits', price: 55, priceUnit: 'piece', category: biscuitCategory._id, subcategory: 'Cream Biscuit', stock: 40, isFeatured: true },
            { name: 'Choco Chip Cookies', description: 'Loaded with chocolate chips', price: 60, priceUnit: 'piece', category: biscuitCategory._id, subcategory: 'Chocolate Biscuit', stock: 30 }
        );

        // Cakes
        const cakeCategory = createdCategories.find(c => c.name === 'Cakes');
        products.push(
            { name: 'Black Forest Cake', description: 'Classic chocolate cake with cherries', price: 650, priceUnit: 'piece', category: cakeCategory._id, subcategory: 'Birthday Cake', stock: 5, isFeatured: true },
            { name: 'Vanilla Pastry', description: 'Fresh cream vanilla pastry', price: 45, priceUnit: 'piece', category: cakeCategory._id, subcategory: 'Pastry', stock: 20 },
            { name: 'Red Velvet Cupcake', description: 'Moist red velvet with cream cheese frosting', price: 40, priceUnit: 'piece', category: cakeCategory._id, subcategory: 'Cup Cake', stock: 15, isFeatured: true },
            { name: 'Truffle Cake', description: 'Rich chocolate truffle cake', price: 750, priceUnit: 'piece', category: cakeCategory._id, subcategory: 'Chocolate Cake', stock: 3 }
        );

        // Sweets (priced per kg)
        const sweetCategory = createdCategories.find(c => c.name === 'Sweets');
        products.push(
            { name: 'Motichoor Laddu', description: 'Traditional orange colored sweet balls', price: 450, priceUnit: 'kg', category: sweetCategory._id, subcategory: 'Laddu', stock: 10, isFeatured: true },
            { name: 'Kaju Katli', description: 'Premium cashew barfi', price: 850, priceUnit: 'kg', category: sweetCategory._id, subcategory: 'Barfi', stock: 8, isFeatured: true },
            { name: 'Gajar Ka Halwa', description: 'Fresh carrot halwa with dry fruits', price: 400, priceUnit: 'kg', category: sweetCategory._id, subcategory: 'Halwa', stock: 5 },
            { name: 'Crispy Jalebi', description: 'Hot and crispy spiral sweets', price: 350, priceUnit: 'kg', category: sweetCategory._id, subcategory: 'Jalebi', stock: 12 }
        );

        // Breads
        const breadCategory = createdCategories.find(c => c.name === 'Breads');
        products.push(
            { name: 'Fresh White Bread', description: 'Soft and fresh white bread', price: 40, priceUnit: 'piece', category: breadCategory._id, subcategory: 'White Bread', stock: 30 },
            { name: 'Whole Wheat Bread', description: 'Healthy brown bread', price: 50, priceUnit: 'piece', category: breadCategory._id, subcategory: 'Brown Bread', stock: 25 },
            { name: 'Sweet Bun', description: 'Soft glazed sweet buns', price: 15, priceUnit: 'piece', category: breadCategory._id, subcategory: 'Bun', stock: 50, isFeatured: true },
            { name: 'Pav Bread', description: 'Fresh dinner rolls', price: 30, priceUnit: 'piece', category: breadCategory._id, subcategory: 'Pav', stock: 60 }
        );

        // Snacks
        const snackCategory = createdCategories.find(c => c.name === 'Snacks');
        products.push(
            { name: 'Veg Puff', description: 'Flaky pastry with vegetable filling', price: 25, priceUnit: 'piece', category: snackCategory._id, subcategory: 'Puff', stock: 40, isFeatured: true },
            { name: 'Paneer Samosa', description: 'Crispy samosa with paneer filling', price: 20, priceUnit: 'piece', category: snackCategory._id, subcategory: 'Samosa', stock: 0 }, // Out of stock example
            { name: 'Butter Khari', description: 'Flaky puff pastry biscuits', price: 120, priceUnit: 'piece', category: snackCategory._id, subcategory: 'Khari', stock: 35 },
            { name: 'Masala Toast', description: 'Crispy spiced toast', price: 80, priceUnit: 'piece', category: snackCategory._id, subcategory: 'Toast', stock: 45 }
        );

        await Product.insertMany(products);
        console.log('Products created');

        console.log('\\n=== Database seeded successfully! ===');
        console.log('Admin: admin@bakery.com / admin123');
        console.log('User: user@test.com / user123');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
