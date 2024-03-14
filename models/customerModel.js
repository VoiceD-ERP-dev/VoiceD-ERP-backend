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
  customerNo: {
    type: String,
    required: true,
    unique: true,
    default: '000100' // Set a default value
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
  nicDoc: [String],
}, {
  timestamps: true
});
customerSchema.pre('save', async function(next) {
  try {
    if (!this.isNew || this.customerNo !== '000100') { // Check if it's new or customerNo is already set
      return next();
    }

    let newCustomerNo = '000100';

    // Find the last customer in the database
    const lastCustomer = await this.constructor.findOne({}, {}, { sort: { 'createdAt': -1 } });
    if (lastCustomer && lastCustomer.customerNo >= '000100') {
      const lastCustomerNo = parseInt(lastCustomer.customerNo, 10);
      if (!isNaN(lastCustomerNo)) { // Check if conversion to integer was successful
        newCustomerNo = (lastCustomerNo + 1).toString().padStart(6, '0');
      } else {
        // Handle the case where the conversion failed
        console.error('Failed to parse last customer number to integer.');
      }
    }

    this.customerNo = newCustomerNo;
    return next();
  } catch (error) {
    return next(error);
  }
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;


