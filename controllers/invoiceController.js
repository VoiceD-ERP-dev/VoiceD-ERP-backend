const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler")

const Invoice = require("../models/invoiceModel");

//@desc Get all invoices
//@route GET /api/invoices
//@access private
const getInvoices = asyncHandler(async (req, res) => {
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

module.exports = { getInvoices, getInvoice };
