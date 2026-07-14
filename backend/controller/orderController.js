const Order = require("../model/order");
const sendEmail = require("../utils/sendEmail");
const Product = require("../model/product");
const mongoose = require("mongoose");

const createOrder = async (req, res) => {
    try {
        // 👉 REMOVED: paymentId from req.body
        const {items, totalPrice, address} = req.body;
        
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "No items in order" });
        }

        const invalidItem = items.find((item) => {
            const quantity = Number(item.quantity);
            const price = Number(item.price);

            return (
                !item.productId ||
                !mongoose.Types.ObjectId.isValid(item.productId) ||
                !Number.isInteger(quantity) ||
                quantity < 1 ||
                !Number.isFinite(price) ||
                price < 0
            );
        });

        if (invalidItem) {
            return res.status(400).json({
                message: "Each order item must include a valid productId, quantity, and price",
            });
        }

        const productIds = [...new Set(items.map((item) => item.productId.toString()))];
        const existingProducts = await Product.countDocuments({ _id: { $in: productIds } });

        if (existingProducts !== productIds.length) {
            return res.status(400).json({ message: "One or more products were not found" });
        }

        if (!Number.isFinite(Number(totalPrice)) || Number(totalPrice) <= 0) {
            return res.status(400).json({ message: "Total price must be greater than 0" });
        }

        if (!address) {
            return res.status(400).json({ message: "Address is required" });
        }

        const requiredAddressFields = ["fullName", "street", "city", "state", "zip", "country"];
        const missingAddressField = requiredAddressFields.find((field) => !address[field]);

        if (missingAddressField) {
            return res.status(400).json({ message: `${missingAddressField} is required in address` });
        }

        // 👉 REMOVED: The entire if(!paymentId) validation block

        const order = new Order({
            user: req.user._id,
            items,
            totalPrice,
            Address: address,
            // 👉 REMOVED: paymentId from order creation
        });
        
        await order.save();
        
        const message =`Dear ${req.user.name},\n\n Thank you for your order. Your order number is ${order._id}. We will send you an email with your order details.`;
        await sendEmail(req.user.email, "Order Confirmation", message);
        
        res.status(201).json(order);
    } catch (error) {
        console.error("--> FATAL ERROR IN CREATE ORDER:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("user", "id name").sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error("--> FATAL ERROR IN GET ORDERS:", error);
        res.status(500).json({ message: "Server error" });
    }
};
const getOrdersById = async (req, res) => {
    try {
        const orders = await Order.find({user: req.user._id}).populate("items.productId", "name price").sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error("--> FATAL ERROR IN GET ORDERS:", error);
        res.status(500).json({ message: "Server error" });
    }
};
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        order.status = req.body.status;

        await order.save();

        res.json(order);
    } catch (error) {
        console.error("--> FATAL ERROR IN UPDATE ORDER STATUS:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    createOrder,
    getOrders,
    getOrdersById,
    updateOrderStatus,
};
