const mongoose = require("mongoose");

const customerSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "Please add the customer firstname"],
  },
  lastname: {
    type: String,
    required: [true, "Please add the customer lastname"],
  },
  nicNo: {
    type: String,
    required: [true, "Please add the customer NIC"],
  },
  brId: {
    type: String,
    required: [true, "Please add the customer BR ID"],
  },
  email: {
    type: String,
    required: [true, "Please add the customer email address"],
  },
  phone: {
    type: String,
    required: [true, "Please add the customer number"],
  },
  address: {
    type: String,
    required: [true, "Please add the customer address"],
  },
  salesman: {
    type: String,
  },
  salesmanID: {
    type: String,
  },
  invoice: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Invoice",
  }],
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  }],
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  }],
  otherDoc: [String],
  brDoc: [String],
  nicDoc: [String],
}, {
  timestamps: true
});

module.exports = mongoose.model("Customer", customerSchema);

