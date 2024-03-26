const asyncHandler = require("express-async-handler");
const  Customer = require("../models/customerModel");
const Order = require("../models/orderModel");
const Invoice = require("../models/invoiceModel");
const Package = require("../models/packageModel");
const sendMail = require("../config/emailSender");
const sendPdfEmail = require('../config/pdfGenerator');
const fs = require('fs');
const path = require('path');
//@desc Get all customers
//@route GET /api/customers
//@access private
const getCustomers = asyncHandler(async (req, res) => {
  // Getting the customers from the db
  // Getting all the customers created by the login in admin
  console.log(req.user.registerId);
  const customers = await Customer.find({ salesmanID: req.user.registerId });
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
    // Check if the email, phone, NIC, or BR ID already exist
    const existingCustomer = await Customer.findOne({
      $or: [{ email }, { phone }, { nicNo }, { brId }]
    });

    if (existingCustomer) {
      let existingField;

      if(existingCustomer.nicNo === nicNo && existingCustomer.phone === phone && existingCustomer.email === email && !existingCustomer.brId.includes(brId)){
        // If NIC exists and BRID is different, add BRID to the existing customer's brId array
        if (!existingCustomer.brId.includes(brId)) {
          existingCustomer.brId.push(brId);
          await existingCustomer.save();
          return res.status(200).json({ message: `Added BRID ${brId} for existing customer` });
        }
      }else{
        if (existingCustomer.email === email) {
          existingField = "Email";
        } else if (existingCustomer.phone === phone) {
          existingField = "Phone";
        } else if (existingCustomer.nicNo === nicNo) {
          existingField = "NIC";

        }else if (existingCustomer.nicNo === nicNo && existingCustomer.phone === phone && existingCustomer.email === email && !existingCustomer.brId.includes(brId)) { 

        }else {
          existingField = "BRID";
        }
        return res.status(400).json({ message: `${existingField} already registered` });
      }
    }

    // Create customer
    const customer = await Customer.create({
      firstname,
      lastname,
      nicNo,
      brId: [brId],
      email,
      phone,
      address,
      salesman: req.user.firstname + " " + req.user.lastname,
      salesmanID: req.user.registerId,
      agentNo: req.user.agentNo,
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
    // Handle other errors
    console.error("Error creating customer:", error);
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
  const {  firstname,lastname,nicNo,brId,email,phone,address } = req.body;
  const customer = await Customer.findById(req.params.id);
  if(!customer) {
    res.status(404);
    throw new Error("Customer not found");
  }
  try{
    customer.firstname = firstname;
    customer.lastname =lastname;
    customer.nicNo =nicNo;
    customer.brId =brId;
    customer.email =email;
    customer.phone =phone;
    customer.address =address;
    await customer.save();
    res.status(200).json(customer);
  } catch (error) {
    console.error('Error updating:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }


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

const downloadDocs = asyncHandler(async (req, res) => {
  const fileName = req.params.filename;
  const filePath = path.join(__dirname, '..', 'uploads', fileName); // Adjust the path here

  // Check if the file exists
  if (fs.existsSync(filePath)) {
      // Set the appropriate headers
      res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
      res.setHeader('Content-type', 'application/octet-stream');

      // Stream the file to the response
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
  } else {
      // If the file does not exist, send a 404 error
      res.status(404).send('File not found');
  }
});


module.exports = {
    getCustomers,
    getAllCustomers,
    createCustomer,
    getCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerbyContact,
    downloadDocs
  };