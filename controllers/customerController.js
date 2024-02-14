const asyncHandler = require("express-async-handler");
const Customer = require("../models/customerModel");
const Order = require("../models/orderModel");
const Invoice = require("../models/invoiceModel");
const sendMail = require("../config/emailSender");
const sendPdfEmail = require('../config/pdfGenerator');
const Package = require("../models/packageModel")

//@desc Get all customers
//@route GET /api/customers
//@access private
const getCustomers = asyncHandler(async (req, res) => {
  const customers = await Customer.find({ user_id: req.admin.id });
  res.status(200).json(customers);
});

//@desc Post customer by id
//@routs POST /api/customers/
//@access private
const createCustomer = asyncHandler(async (req, res) => {
  const { name, email, phone, invoice } = req.body;


  // Validate customer data
  if (!name || !email || !phone || !invoice || !Array.isArray(invoice) || invoice.length === 0) {
    return res.status(400).json({ message: "Invalid request format" });
  }

  // Check if user is admin or salesman
  if (!(req.user.role === "admin" || req.user.role === "salesman")) {
    return res.status(403).json({ message: "Not authorized" });
  }

  try {
    // Create customer
    const customer = await Customer.create({
      name,
      email,
      phone,
    });
    
    if (req.file) {
      customer.img = req.file.path;
    }

    const orderIds = [];
    const invoiceIds = [];

    // Loop through each invoice and create orders and invoices for the customer
    for (const invoiceData of invoice) {
      // Create order
      const order = await Order.create({
        customer: customer._id,
        description: invoiceData.order.description,
        
      });
      orderIds.push(order._id);


      // Create invoice
      const newInvoice = await Invoice.create({
        customer: customer._id,
        order: order._id,
        description: invoiceData.description,
      });
      invoiceIds.push(newInvoice._id);


      const newPackage = await Package.create({
        description: invoiceData.package.description,
        invoice: newInvoice._id,
      });
      order.invoice = newInvoice._id;
      await order.save();

      newInvoice.package = newPackage._id;
      await newInvoice.save();
    }

    // Update customer with order IDs
    customer.orders = orderIds;
    customer.invoice = invoiceIds;
    await customer.save();

    const pdfSent = await sendPdfEmail(name,email,phone);
    if(!pdfSent){
      throw new Error("Failed to send PDF via email!!")
    }

    res.status(201).json(customer);
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ message: "Server error" });
  }
});


//@desc Get new customers
//@route GET /api/customers/:id
//@access private
const getCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    res.status(404);
    throw new Error("Customer not found");
  }

  res.status(200).json(customer);
});

//@desc Update all customers
//@route UPDATE /api/customers/:id
//@access private
const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    res.status(404);
    throw new Error("Customer not found");
  }
  if (customer.user_id.toString() !== req.admin.id) {
    res.status(402);
    throw new Error("User don't have permission to update this");
  }
  const updatedCustomer = await Customer.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedCustomer);
});

//@desc Delete a customer
//@routs DELETE /api/customers/:id
//@access private
const deleteCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    res.status(404);
    throw new Error("Customer not found");
  }
  if (customer.user_id.toString() !== req.admin.id) {
    res.status(402);
    throw new Error("User don't have permission to update this");
  }

  await Customer.deleteOne({ _id: req.params.id });
  res.status(200).json(customer);
});


module.exports = {
  getCustomers,
  createCustomer,
  getCustomer,
  updateCustomer,
  deleteCustomer,
};
