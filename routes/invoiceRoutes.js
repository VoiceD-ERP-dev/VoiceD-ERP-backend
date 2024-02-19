const express = require('express');
const router = express.Router();
const { getInvoices, getInvoice } = require('../controllers/invoiceController');



// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Private
router.get('/', getInvoices);

// @desc    Get invoice by ID
// @route   GET /api/invoices/:id
// @access  Private
router.get('/:id',getInvoice);

module.exports = router;
