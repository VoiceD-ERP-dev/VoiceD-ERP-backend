const mongoose = require("mongoose");

const reasonSchema = mongoose.Schema({
  reasonNo: {
    type: String,
  },
  description: {
    type: String,
  },
  dateAndTime: {
    type: Date,
  }
});

const invoiceSchema = mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Customer",
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  },
  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Package",
  },
  paymentType: {
    type: String,
    required: true,
  },
  invoiceNo: {
    type: String,
    required: true,
    unique: true,
    default: '000150' // Set a default value
  },
  status: {
    type: String,
    required: true
  },
  proofDocs: {
    type: String
  },
  registerId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "registerId",
  },
  agentNo : {
    type : String,
    required: [true, "Please add the admin agentNo"],
    //unique : [true, "Agent number is already taken"]
  },
  customerNo: {
    type: String,
  },
  customerName: {
    type: String,
  },
  rejectReason: [reasonSchema],
  declineReason: [reasonSchema],
}, {
  timestamps: true
});

// Pre-save hook to generate and assign invoice number
invoiceSchema.pre('save', async function(next) {
  try {
    if (!this.isNew || this.invoiceNo !== '000150') { // Check if it's new or invoiceNo is already set
      return next();
    }

    
    let newInvoiceNo = '000150';

    const lastInvoice = await this.constructor.findOne({}, {}, { sort: { 'createdAt': -1 } });
    if (lastInvoice && lastInvoice.invoiceNo >= '000150') {
      const lastInvoiceNo = parseInt(lastInvoice.invoiceNo, 10);
      if (!isNaN(lastInvoiceNo)) { // Check if conversion to integer was successful
        newInvoiceNo = (lastInvoiceNo + 1).toString().padStart(6, '0');
      } else {
        // Handle the case where the conversion failed
        console.error('Failed to parse last invoice number to integer.');
      }
    }

    this.invoiceNo = newInvoiceNo;
    return next();
  } catch (error) {
    return next(error);
  }
});


const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
