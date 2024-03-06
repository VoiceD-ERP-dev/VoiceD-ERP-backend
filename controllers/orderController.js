const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");
const sendCompletedOrder = require("../config/completeOrderMailSender");
const  Customer = require("../models/customerModel");


const completeOrder = asyncHandler(async (req, res) => {
  const {  progress } = req.body;
  const { id } = req.params;
  // Validate order data
  if (!progress) {
    return res.status(400).json({ message: "invoice and description are required" });
  }

  try {

    const order = await Order.findById(id);
    if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
    }
    order.progress = progress;
    await order.save();
    const customer = await Customer.findById(order.customer);
    sendCompletedOrder(customer.firstname,customer.email, order.estDeliveryDate, order.orderNo);
    res.status(201).json(order);
  } catch (error) {
    console.error("Error completing order:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = { completeOrder };
