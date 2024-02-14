const mongoose = require("mongoose");

const customerSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add the customer name"],
  },
  email: {
    type: String,
    required: [true, "Please add the customer email address"],
  },
  phone: {
    type: String,
    required: [true, "Please add the customer number"],
  },
  invoice: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Invoice",
  }],
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  }],
  otherDoc: [String],
  brDoc: [String],
  nicImg: [String],
}, {
  timestamps: true
});

module.exports = mongoose.model("Customer", customerSchema);

