const asyncHandler = require("express-async-handler");
const  Customer = require("../models/customerModel");
const Order = require("../models/orderModel");
const Invoice = require("../models/invoiceModel");
//@desc Get all customers
//@route GET /api/customers
//@access private
const getCustomers = asyncHandler(async (req, res) => {    //async makes a function return a Promise
  //getting the customers from the db
  //getting all the customers created by the login in admin
  const customers = await Customer.find({ user_id: req.admin.id });  //await makes a function wait for a Promise
    res.status(200).json(customers);
  });

//@desc Post customer by id
//@routs POST /api/customers/
//@access private
const createCustomer = asyncHandler(async (req, res) => {
  const { name, email, phone, orders, invoice } = req.body;

  // Validate customer data
  if (!name || !email || !phone || !Array.isArray(orders) || !invoice || !invoice.description) {
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

    // Create orders for the customer
    const orderIds = [];
    for (const orderData of orders) {
      const order = await Order.create({
        customer: customer._id,
        description: orderData.description,
      });
      orderIds.push(order._id);
    }

    // Create invoice for the customer
    const invoiceObj = await Invoice.create({
      customer: customer._id,
      order: orderIds, // Assuming all orders are associated with this invoice
      description: invoice.description,
    });

    // Update customer with order IDs and invoice ID
    customer.orders = orderIds;
    customer.invoice = invoiceObj._id;
    await customer.save();

    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = { createCustomer };
//@desc Get new customers
//@route GET /api/customers/:id
//@access private
const getCustomer = asyncHandler(async (req, res) => {
    //getting the customer by id
    const customer = await Customer.findById(req.params.id);
    if(!customer) {
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
    if(!customer) {
      res.status(404);
      throw new Error("Customer not found");
    }
    //checking weather the admin id of the login admin is matching with the updating customer
    if (customer.user_id.toString() !== req.admin.id) {
      res.status(402);
      throw new Error("User don't have permission to update this");
    }
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id, //getting the id of the customer that needs to be updated
      req.body, //getting the updated body
      { new: true } //query option
    );
  
  
    res.status(200).json(updatedCustomer);
  });


//@desc Delete a customer
//@routs DELETE /api/customers/:id
//@access private
const deleteCustomer = asyncHandler(async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if(!customer) {
      res.status(404);
      throw new Error("Customer not found");
    }
    //checking weather the admin id of the login admin is matching with the deleting customer
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