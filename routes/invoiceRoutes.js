const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {createInvoice, getInvoices, getInvoice,uploadProof,updateRejectReason,getAllInvoices } = require('../controllers/invoiceController');
const validateToken = require("../middleware/validateTokenHandler");

// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Private
router.post('/create',validateToken, createInvoice);

// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Private
router.get('/',validateToken, getInvoices);

// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Private
router.get('/all', getAllInvoices);

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
