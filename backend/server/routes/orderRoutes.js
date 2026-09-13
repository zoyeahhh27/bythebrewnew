const express = require("express");
const Order = require("../models/Order");

const adminRoutes = require("./adminRoutes");
const requireAdmin = adminRoutes.requireAdmin;

const router = express.Router();


// ============================================
// PLACE ORDER
// PUBLIC
// Customers can place orders without admin login
// ============================================

router.post("/", async (req, res) => {
  try {
    const { customer, items, total } = req.body;

    if (
      !customer ||
      !items ||
      items.length === 0 ||
      total === undefined
    ) {
      return res.status(400).json({
        message: "Missing order details",
      });
    }

    const order = new Order({
      customer,
      items,
      total,
    });

    const savedOrder = await order.save();

    res.status(201).json({
      message: "Order placed successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error(
      "Error creating order:",
      error
    );

    res.status(500).json({
      message: "Failed to place order",
      error: error.message,
    });
  }
});


// ============================================
// GET ALL ORDERS
// ADMIN ONLY
// ============================================

router.get("/", requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (error) {
    console.error(
      "Error fetching orders:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
});


// ============================================
// UPDATE ORDER STATUS
// ADMIN ONLY
// ============================================

router.patch(
  "/:id/status",
  requireAdmin,
  async (req, res) => {
    try {
      const { status } = req.body;

      const validStatuses = [
        "Pending",
        "Preparing",
        "Ready",
        "Completed",
      ];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid order status",
        });
      }

      const order =
        await Order.findByIdAndUpdate(
          req.params.id,
          { status },
          { new: true }
        );

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      res.json({
        message: "Order status updated",
        order,
      });
    } catch (error) {
      console.error(
        "Error updating order:",
        error
      );

      res.status(500).json({
        message: "Failed to update order",
        error: error.message,
      });
    }
  }
);

module.exports = router;