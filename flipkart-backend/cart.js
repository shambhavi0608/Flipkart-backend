const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const Cart = mongoose.model('Cart', new mongoose.Schema({
    userId: String,
    items: [
        {
            productId: String,  // ✅ Fixed typo: "productIId" → "productId"
            quantity: Number
        }
    ],
    status: {
        type: String,
        default: 'active'
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}));

// Add item to cart
router.post('/cart/add', async (req, res) => {
    try {
        const { productId, quantity = 1, user } = req.body;

        if (!productId || !user) {
            return res.status(400).json({ message: "ProductId and user are required" });
        }

        let cart = await Cart.findOne({ userId: user, status: 'active' });

        if (!cart) {
            cart = new Cart({ userId: user, items: [], status: 'active' });
        }

        const existingItemIndex = cart.items.findIndex(item => item.productId === productId);

        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += parseInt(quantity);
        } else {
            cart.items.push({
                productId,
                quantity: parseInt(quantity)
            });
        }

        cart.updatedAt = new Date();
        await cart.save();

        res.status(200).json({ message: "Item added to cart", cart });

    } catch (err) {
        console.error("Error adding item to cart:", err);
        res.status(500).json({ error: "Internal server error, item has not been added" });
    }
});

// Get all carts
router.get('/carts', async (req, res) => {
    try {
        const carts = await Cart.find({});
        res.status(200).json({
            success: true,
            count: carts.length,
            data: carts
        });
    } catch (error) {
        console.log("Error fetching carts:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch data",
            error: error.message
        });
    }
});

// TODO: Add logic for delete route
router.delete("/cart/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCart = await Cart.findByIdAndDelete(id);
        if (!deletedCart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }
        res.status(200).json({ success: true, message: "Cart deleted", data: deletedCart });
    } catch (err) {
        console.error("Error deleting cart:", err);
        res.status(500).json({ success: false, message: "Failed to delete cart", error: err.message });
    }
});

// ✅ Correct export
module.exports = router;
