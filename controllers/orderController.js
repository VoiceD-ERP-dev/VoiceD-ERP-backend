const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");

const createOrder = asyncHandler(async (req, res) => {
  const { customer_id, description } = req.body;

  // Validate order data
  if (!customer_id || !description) {
    return res.status(400).json({ message: "Customer ID and description are required" });
  }

  try {
    const order = await Order.create({
      customer: customer_id,
      description,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = { createOrder };
