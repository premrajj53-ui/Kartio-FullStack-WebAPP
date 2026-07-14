const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

const User = require('./model/user');
const Product = require('./model/product');
const Order = require('./model/order');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const users = [
    {
        name: 'Admin User',
        email: 'admin@kartio.com',
        username: 'admin@kartio.com',
        password: 'admin123',
        role: 'admin',
        verified: true,
    },
    {
        name: 'Prem Raj',
        email: 'prem@kartio.com',
        username: 'prem@kartio.com',
        password: 'user123',
        role: 'user',
        verified: true,
    },
    {
        name: 'Ananya Sharma',
        email: 'ananya@kartio.com',
        username: 'ananya@kartio.com',
        password: 'user123',
        role: 'user',
        verified: true,
    },
];

const products = [
    {
        name: 'Wireless Headphones',
        description: 'Comfortable Bluetooth headphones with clear sound and long battery life.',
        price: 2499,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
        stock: 25,
        rating: 4.5,
        numReviews: 18,
    },
    {
        name: 'Smart Watch',
        description: 'Fitness-focused smart watch with heart-rate tracking and notifications.',
        price: 3499,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
        stock: 15,
        rating: 4.2,
        numReviews: 12,
    },
    {
        name: 'Cotton T-Shirt',
        description: 'Soft everyday cotton t-shirt with a relaxed fit.',
        price: 599,
        category: 'Fashion',
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
        stock: 60,
        rating: 4.1,
        numReviews: 30,
    },
    {
        name: 'Running Shoes',
        description: 'Lightweight running shoes with cushioned sole support.',
        price: 2199,
        category: 'Footwear',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
        stock: 20,
        rating: 4.6,
        numReviews: 24,
    },
    {
        name: 'Backpack',
        description: 'Durable backpack with laptop sleeve and multiple storage pockets.',
        price: 1299,
        category: 'Bags',
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
        stock: 35,
        rating: 4.3,
        numReviews: 16,
    },
];

const sampleAddress = {
    fullName: 'Prem Raj',
    street: '12 Market Street',
    city: 'Chennai',
    state: 'Tamil Nadu',
    zip: '600001',
    country: 'India',
};

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is missing in backend/.env');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding');
};

const seedUsers = async () => {
    const seededUsers = [];

    for (const user of users) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const seededUser = await User.findOneAndUpdate(
            { email: user.email },
            { ...user, password: hashedPassword },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        seededUsers.push(seededUser);
    }

    return seededUsers;
};

const seedProducts = async () => {
    const seededProducts = [];

    for (const product of products) {
        const seededProduct = await Product.findOneAndUpdate(
            { name: product.name },
            product,
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        seededProducts.push(seededProduct);
    }

    return seededProducts;
};

const seedOrders = async (seededUsers, seededProducts) => {
    const existingSeedOrders = await Order.countDocuments({
        paymentId: { $regex: '^seed_pay_' },
    });

    if (existingSeedOrders > 0) {
        console.log('Seed orders already exist, skipping order creation');
        return;
    }

    const customer = seededUsers.find((user) => user.role === 'user');
    const [headphones, watch, tshirt, shoes] = seededProducts;

    await Order.insertMany([
        {
            user: customer._id,
            items: [
                { productId: headphones._id, quantity: 1, price: headphones.price },
                { productId: tshirt._id, quantity: 2, price: tshirt.price },
            ],
            totalPrice: headphones.price + tshirt.price * 2,
            status: 'delivered',
            Address: sampleAddress,
            paymentId: 'seed_pay_001',
        },
        {
            user: customer._id,
            items: [
                { productId: watch._id, quantity: 1, price: watch.price },
            ],
            totalPrice: watch.price,
            status: 'shipped',
            Address: sampleAddress,
            paymentId: 'seed_pay_002',
        },
        {
            user: customer._id,
            items: [
                { productId: shoes._id, quantity: 1, price: shoes.price },
            ],
            totalPrice: shoes.price,
            status: 'pending',
            Address: sampleAddress,
            paymentId: 'seed_pay_003',
        },
    ]);
};

const seedData = async () => {
    try {
        await connectDB();

        const seededUsers = await seedUsers();
        const seededProducts = await seedProducts();
        await seedOrders(seededUsers, seededProducts);

        console.log('Dummy data seeded successfully');
        console.log('Admin login: admin@kartio.com / admin123');
        console.log('User login: prem@kartio.com / user123');
    } catch (error) {
        console.error('Seed failed:', error);
        process.exitCode = 1;
    } finally {
        await mongoose.connection.close();
    }
};

seedData();
