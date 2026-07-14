const express = require("express");
const router = express.Router();
const { getOrders, createOrder, getOrdersById,updateOrderStatus, } = require("../controller/orderController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddlewere");


router.route("/").post(protect,createOrder).get(protect, admin, getOrders);
router.route("/myOrders").get(protect, getOrdersById);
router.route("/:id/status").put(protect, admin, updateOrderStatus);

module.exports = router;
