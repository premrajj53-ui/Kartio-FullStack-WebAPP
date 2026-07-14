const Order = require('../model/order');
const User = require('../model/user');
const Product = require('../model/product');

const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalProducts = await Product.countDocuments({});
        const totalOrders = await Order.countDocuments({});

        const orders = await Order.find({});
        const totalRevenue = orders.reduce((acc, order) => acc + Number(order.totalPrice || 0), 0);

        res.json({
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue,
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getAdminStats,
};
