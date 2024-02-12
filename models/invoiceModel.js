const mongoose = require("mongoose");

const invoiceSchema = mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Customer",
  },
  order: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  }],
  description: {
    type: String,
    required: true,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model("Invoice", invoiceSchema);

