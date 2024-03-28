const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler")
const  Customer = require("../models/customerModel");
const Invoice = require("../models/invoiceModel");
const User = require("../models/userModel");
const Salesman = require("../models/salesmanModel");
const sendRejectMail = require('../config/rejectMailSender');
const Package = require("../models/packageModel");
const sendMail = require("../config/emailSender");
const sendPdfEmail = require('../config/pdfGenerator');
const { addWeeks, format } = require('date-fns');
const Order = require("../models/orderModel");
const sendPaymentConfirmation = require("../config/paymentMailSender");

const createInvoice = asyncHandler(async(req,res) =>{
  const { customerId,paymentType,package,startupFee,agentNo,customerNo,customerName} = req.body;
  if (!(req.user.role === "admin" || req.user.role === "sales" ||req.user.role === "superadmin" )) {
    return res.status(403).json({ message: "Not authorized" });
  }
  try{
    let packagePrice = "";
    if (package === "Basic") {
      packagePrice = 3000;
    } else if (package === "Platinum") {
      packagePrice = 7000;
    } else {
      packagePrice = 12000;
    }

    const newInvoice = await Invoice.create({
      customerId,
      paymentType,
      status: "Pending",
      registerId: req.user.registerId, 
      agentNo,
      customerNo,
      customerName,
      packagename: package
    });
  
    const newPackage = await Package.create({
      package,
      startupFee,
      invoice: newInvoice._id,
      packagePrice: packagePrice,
    });
  
    newInvoice.package = newPackage._id;
    await newInvoice.save();
    res.status(201).json(newInvoice);

    let orderId = newInvoice.invoiceNo;
    let invoiceId = newInvoice.invoiceNo;
    const customer = await Customer.findById(customerId);

    customer.invoice.push(newInvoice._id);
    await customer.save();

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    // Extract required fields from the customer object
    const {firstname, lastname,email,nicNo,address, phone, } = customer;
//---------------------------------------------------------------------------------
    const today = new Date();
    const formattedDueDate = addWeeks(today, 2);
    const duedate = format(formattedDueDate, 'yyyy/MM/dd');
    const currentDate = format(today, 'yyyy/MM/dd');
    console.log("Current Date:", currentDate);
    console.log("Due Date:", duedate);
    
//--------------------------------------------------------------------------------

    const pdfSent = await sendPdfEmail(firstname, lastname,email,nicNo,address, phone,invoiceId,orderId,currentDate,duedate,package,packagePrice,startupFee);
    if(!pdfSent){
      throw new Error("Failed to send PDF via email!!")
    }

  } catch (error) {
    console.error("Error creating package:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//@desc Get all invoices
//@route GET /api/invoices
//@access private
const getInvoices = asyncHandler(async (req, res) => {
  // Get all invoices
  const invoices = await Invoice.find({ registerId: req.user.registerId });
  res.status(200).json(invoices);
});

//@desc Get all invoices
//@route GET /api/invoices
//@access private
const getAllInvoices = asyncHandler(async (req, res) => {
  // Get all invoices
  const invoices = await Invoice.find();
  res.status(200).json(invoices);
});

//@desc Get invoice by ID
//@route GET /api/invoices/:id
//@access private
const getInvoice = asyncHandler(async (req, res) => {
  // Get invoice by ID
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) {
    res.status(404);
    throw new Error("Invoice not found");
  }
  res.status(200).json(invoice);
});

const uploadProof = asyncHandler(async (req,res) =>{

  try {
    const { id } = req.params;
    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // If file was uploaded successfully, set proofDocs field to the file path
    invoice.proofDocs = req.file.path;

    // Save the updated invoice
    await invoice.save();

    res.status(200).json({ message: 'ProofDocs uploaded successfully', invoice });
  } catch (error) {
    console.error('Error uploading proofDocs:', error);
    res.status(500).json({ message: 'Server error' });
  }
})

// Controller function to update rejectReason field in an invoice
const updateStatus = async (req, res) => {
  const { status,responsibleDep,managerInCharge,startingDate,estDeliveryDate,packageName,description} = req.body;
  const { id } = req.params;
  // Find the invoice by ID
  const invoice = await Invoice.findById(id);
  if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
  }

  // Retrieve the customer ID from the invoice
  const customerId = invoice.customerId;

  // Find the customer by ID
  const customer = await Customer.findById(customerId);

  if (!customer) {
    return res.status(404).json({ success: false, message: 'Customer not found' });
  }

  // Extract required fields from the customer object
  const { _id,firstname, lastname, salesman,salesmanID } = customer;
  console.log(customer.salesmanID);
  const sales = await User.find({ registerId: salesmanID });
  const{email} = sales;
  // Log the extracted data
  console.log('Customer Data:', { firstname, lastname, salesman, email });
  

  if(status==="Rejected"){
    try {
      // Generate reasonNo (assuming it's the length of the existing rejectReason array + 1)
      const reasonNo = invoice.rejectReason.length + 1;

      // Create a new reject reason object
      const newRejectReason = {
          reasonNo,
          description,
          dateAndTime: new Date().toISOString() // Current timestamp
      };
      invoice.status = status;
      await invoice.save();
      // Add the new reject reason object to the rejectReason array
      invoice.rejectReason.push(newRejectReason);

      // Save the updated invoice
      await invoice.save();
      //--------------------------------------------------------------------------
      let subjectText = "Rejection Notification: Invoice ";
      let header1 = "We regret to inform you that recent invoice that you created has been rejected due to the following reason:";
      let header2 = "If the customer still wishes to proceed with the transaction, please create a new invoice and initiate the process again. We appreciate your prompt attention to this matter.";
      //--------------------------------------------------------------------------
      const pdfSent = await sendRejectMail(subjectText,header1,header2,invoice.invoiceNo,_id,firstname, lastname, email, salesman,description );
      if(!pdfSent){
        throw new Error("Failed to send PDF via email!!")
      }
      // Respond with updated invoice
      res.status(200).json({ success: true, data: invoice });
    } catch (error) {
      console.error('Error updating reject reason:', error);
      res.status(500).json({ success: false, message: 'Server error' });
  }
  }else if(status=="Decline"){
    try{
      // Generate reasonNo (assuming it's the length of the existing rejectReason array + 1)
      const reasonNo = invoice.declineReason.length + 1;

      // Create a new reject reason object
      const newdeclineReason = {
          reasonNo,
          description,
          dateAndTime: new Date().toISOString() // Current timestamp
      };
      invoice.status = "Pending (Declined "+ reasonNo + " times)";
      // Add the new reject reason object to the rejectReason array
      invoice.declineReason.push(newdeclineReason);

      // Save the updated invoice
      await invoice.save();

      //--------------------------------------------------------------------------
      let subjectText = "Declension Notification - Payment Slip Uploaded : Invoice ";
      let header1 = "We regret to inform you that recent the Payment slip you uploaded has been rejected due to the following reason:";
      let header2 = "Please review the provided reason and ensure that your next upload meets our requirements. We kindly request you to upload the corrected photo within the next 24 hours.";
      //--------------------------------------------------------------------------
      const pdfSent = await sendRejectMail(subjectText,header1,header2,invoice.invoiceNo,_id,firstname, lastname, email, salesman,description );
      if(!pdfSent){
        throw new Error("Failed to send PDF via email!!")
      }
      // Respond with updated invoice
      res.status(200).json({ success: true, data: invoice });
    } catch (error) {
      console.error('Error updating reject reason:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }else if(status=="Accept"){
    try{
      const order = await Order.create({
        customer: customerId,
        invoice: invoice._id,
        package:invoice.package,
        packageName,
        invoiceDate:invoice.createdAt,
        responsibleDep,
        managerInCharge,
        startingDate,
        progress:"InProgress",
        estDeliveryDate,
        description,
      });
      customer.orders.push(order._id);
      await customer.save();

      
      invoice.order = order._id;
      invoice.status = status;
      await invoice.save();

      const package = await Package.findById(invoice.package);
      const{packagePrice} = package;
      let total = parseInt(packagePrice) + 2990;
      console.log(total);
      sendPaymentConfirmation(customer.email,firstname,order.orderNo,invoice.invoiceNo,invoice.paymentType,total,order.estDeliveryDate)
      
      res.status(201).json(order);
    } catch (error) {
      console.error('Error updating reject reason:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

};

module.exports = {createInvoice, getInvoices, getInvoice, uploadProof, updateStatus,getAllInvoices };

