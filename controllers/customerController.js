const asyncHandler = require("express-async-handler");
const  Customer = require("../models/customerModel");
const Order = require("../models/orderModel");
const Invoice = require("../models/invoiceModel");
const Package = require("../models/packageModel");
const sendMail = require("../config/emailSender");
const sendPdfEmail = require('../config/pdfGenerator');

//@desc Get all customers
//@route GET /api/customers
//@access private
const getCustomers = asyncHandler(async (req, res) => {    //async makes a function return a Promise
  //getting the customers from the db
  //getting all the customers created by the login in admin
  const customers = await Customer.find({ salesmanID: req.user.registeredId });  //await makes a function wait for a Promise
    res.status(200).json(customers);
  });

//@desc Get all customers
//@route GET /api/customers
//@access private
const getAllCustomers = asyncHandler(async (req, res) => {    //async makes a function return a Promise
  //getting the customers from the db
  //getting all the customers created by the login in admin
  const customers = await Customer.find({});  //await makes a function wait for a Promise
    res.status(200).json(customers);
  });

//@desc Post customer by id
//@routs POST /api/customers/
//@access private
const createCustomer = asyncHandler(async (req, res) => {
  const { firstname, lastname, nicNo, brId, email, phone, address, invoice } = req.body;

  // Validate customer data
  if (!firstname || !lastname || !nicNo || !brId || !email || !phone || !address) {
    return res.status(400).json({ message: "Invalid request format" });
  }

  // Check if user is admin or salesman
  if (!(req.user.role === "admin" || req.user.role === "sales" || req.user.role === "superadmin")) {
    return res.status(403).json({ message: "Not authorized" });
  }

  try {
    // Create customer
    const customer = await Customer.create({
      firstname,
      lastname,
      nicNo,
      brId,
      email,
      phone,
      address,
      salesman: req.user.firstname + " " + req.user.lastname,
      salesmanID: req.user.registerId,
      // Add other fields as needed
    });

    if (req.files) {
      const nicDocFiles = req.files['nicDoc'];
      const brDocFiles = req.files['brDoc'];
      const otherDocFiles = req.files['otherDoc'];

      if (nicDocFiles) {
        nicDocFiles.forEach(file => customer.nicDoc.push(file.path));
      }
      if (brDocFiles) {
        brDocFiles.forEach(file => customer.brDoc.push(file.path));
      }
      if (otherDocFiles) {
        otherDocFiles.forEach(file => customer.otherDoc.push(file.path));
      }
    }

    await customer.save();

    res.status(201).json(customer);
  } catch (error) {
    // Check if the error is due to duplicate key violation (email or phone already registered)
    if (error.code === 11000 || error.code === 11001) {
      let errorMessage = "";
      if (error.keyPattern.email) {
        errorMessage = "Email is already registered";
      } else if (error.keyPattern.phone) {
        errorMessage = "Phone number is already registered";
      }
      return res.status(400).json({ message: errorMessage });
    }
    console.error("Error creating package:", error);
    res.status(500).json({ message: "Server error" });
  }
});




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

//@desc Get all customers
//@route GET /api/customers
//@access private
const getCustomerbyContact = asyncHandler(async (req, res) => {    //async makes a function return a Promise
  //getting the customers from the db
  //getting all the customers created by the login in admin
  const customers = await Customer.find({ phone: req.params.id});  //await makes a function wait for a Promise
    res.status(200).json(customers);
});

module.exports = {
    getCustomers,
    getAllCustomers,
    createCustomer,
    getCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerbyContact
  };