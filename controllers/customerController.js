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
  const { firstname,lastname,nicNo,brId, email, phone,address,invoice } = req.body;

  // Validate customer data
   if (!firstname || !lastname || !nicNo || !brId || !email || !phone || !address || !invoice || !Array.isArray(invoice) || invoice.length === 0) {
     return res.status(400).json({ message: "Invalid request format" });
  }

  // Check if user is admin or salesman
  if (!(req.user.role === "admin" || req.user.role === "sales")) {
    return res.status(403).json({ message: "Not authorized" });
  }
  let pdfSent = false;
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
      salesman : req.user.firstname +" " + req.user.lastname,
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
      var paymentType = invoiceData.paymentType;
      if(paymentType == "Direct Purchase"){
        var invoiceStatus = "approved";
      }else{
        invoiceStatus = "pending"
      }

      const newInvoice = await Invoice.create({
        customer: customer._id,
        order: order._id,
        paymentType: invoiceData.paymentType,
        status: invoiceStatus,
      });
      invoiceIds.push(newInvoice._id);

      const newPackage = await Package.create({
        package: invoiceData.package.package,
        startupFee: invoiceData.package.startupFee,
        invoice: newInvoice._id,
      });
      let startupFee = invoiceData.package.startupFee;
      let package= invoiceData.package.package;
      let packagePrice = "";
      if (invoiceData.package.package === "Basic") {
        packagePrice = 3000;
    
      } else if (invoiceData.package.package === "Platinum") {
        packagePrice = 7000;
      } else {
        packagePrice = 12000;
      }


      order.invoice = newInvoice._id;
      await order.save();

      //---------------------------------------------------------------------------------
      const today = new Date();

      // Get the current year, month, and day
      let year = today.getFullYear();
      let month = today.getMonth() + 1; // Note: January is 0
      let day = today.getDate();
      
      // Ensure month and day are two digits
      month = month < 10 ? '0' + month : month;
      day = day < 10 ? '0' + day : day;
      
      // Set currentDate in the specified format (yyyy/mm/dd)
      const currentDate = `${year}/${month}/${day}`;
      
      // Add two months to the current month
      month += 2;
      
      // Check if the month exceeds 12 (December), adjust year and month accordingly
      if (month > 12) {
        month -= 12; // Reset month to January
        
      }
      
      // Ensure month is two digits
      month = month < 10 ? '0' + month : month;
      
      // Get the last day of the next month
      const lastDayOfMonth = new Date(year, month, 0).getDate();
      
      // Set duedate to the last day of the next month
      const duedate = `${year}/${month}/${lastDayOfMonth}`;
      
      console.log("Current Date:", currentDate);
      console.log("Due Date:", duedate);
      
      
      //--------------------------------------------------------------------------------

      let orderId = order.orderNo;
      let invoiceId = newInvoice.invoiceNo;
      newInvoice.package = newPackage._id;
      await newInvoice.save();
      const pdfSent = await sendPdfEmail(firstname, lastname,email,nicNo,address, phone,invoiceId,orderId,currentDate,duedate,package,packagePrice,startupFee);
      if(!pdfSent){
        throw new Error("Failed to send PDF via email!!")
      }
    }


    // Update customer with order IDs
    customer.orders = orderIds;
    customer.invoice = invoiceIds;
    await customer.save();


    

    res.status(201).json(customer);
  } catch (error) {
    console.error("Error creating package:", error);
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
    getAllCustomers,
    createCustomer,
    getCustomer,
    updateCustomer,
    deleteCustomer,
    
  };