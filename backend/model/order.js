const mongoose = require("mongoose");
const userSchema = require("./user");
const productSchema = require("./product");

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [{
       productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        price: {
            type: Number,
            required: true,
        },

    },
    ],
    totalPrice: { type: Number, required: true },
    status: {
        type: String,
        enum: ["pending", "delivered", "cancelled","shipped"],
        default: "pending",
    },
    Address: {
        fullName: {
            type: String,
            required: true,
        },
        street: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        zip: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        }
    }
},
  {timestamps: true});

module.exports = mongoose.model("Order", orderSchema);
