const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { getInvoices, getInvoice,uploadProof,updateRejectReason } = require('../controllers/invoiceController');



// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Private
router.get('/', getInvoices);

// @desc    Get invoice by ID
// @route   GET /api/invoices/:id
// @access  Private
router.get('/:id',getInvoice);

// @desc    Upload proof documents for an invoice
// @route   PATCH /api/invoices/:id/uploadProof
// @access  Private
router.patch('/:id/uploadProof', upload.single('proofDoc'), uploadProof);

// @desc    Update reject reason
// @route   PATCH /api/invoices/:id/updateRejectReason
// @access  Private
router.patch('/:id/updateRejectReason', updateRejectReason);

module.exports = router;
