const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler")
const  Customer = require("../models/customerModel");
const Invoice = require("../models/invoiceModel");
const Salesman = require("../models/salesmanModel");
const sendRejectMail = require('../config/rejectMailSender');

//@desc Get all invoices
//@route GET /api/invoices
//@access private
const getInvoices = asyncHandler(async (req, res) => {
  // Get all invoices
  const invoices = await Invoice.find({ registerId: req.user.registeredId });
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
const updateRejectReason = async (req, res) => {
  try {
      const { id } = req.params;
      const { description } = req.body;

      // Find the invoice by ID
      const invoice = await Invoice.findById(id);

      if (!invoice) {
          return res.status(404).json({ success: false, message: 'Invoice not found' });
      }

      // Generate reasonNo (assuming it's the length of the existing rejectReason array + 1)
      const reasonNo = invoice.rejectReason.length + 1;

      // Create a new reject reason object
      const newRejectReason = {
          reasonNo,
          description,
          dateAndTime: new Date().toISOString() // Current timestamp
      };

      // Add the new reject reason object to the rejectReason array
      invoice.rejectReason.push(newRejectReason);

      // Save the updated invoice
      await invoice.save();

            // Retrieve the customer ID from the invoice
      const customerId = invoice.customer;

      // Find the customer by ID
      const customer = await Customer.findById(customerId);

      if (!customer) {
        return res.status(404).json({ success: false, message: 'Customer not found' });
      }

      // Extract required fields from the customer object
      const { _id,firstname, lastname, salesman,salesmanID } = customer;

      const sales = await Salesman.findById(salesmanID);
      const{email} = sales;
      // Log the extracted data
      console.log('Customer Data:', { firstname, lastname, salesman, email });

      const pdfSent = await sendRejectMail(_id,firstname, lastname, email, salesman,description );
      if(!pdfSent){
        throw new Error("Failed to send PDF via email!!")
      }
      // Respond with updated invoice
      res.status(200).json({ success: true, data: invoice });
  } catch (error) {
      console.error('Error updating reject reason:', error);
      res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getInvoices, getInvoice, uploadProof, updateRejectReason,getAllInvoices };

