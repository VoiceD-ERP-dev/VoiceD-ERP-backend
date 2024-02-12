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
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  }],
  invoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Invoice",
  },
}, {
  timestamps: true
});

module.exports = mongoose.model("Customer", customerSchema);

