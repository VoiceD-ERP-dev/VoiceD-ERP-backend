const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Customer",
  },
  description: {
    type: String,
    required: true,
  },
  invoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Invoice",
  },
  orderNo: {
    type: String,
    required: true,
    unique: true,
    default: '000001' // Set a default value for order number
  },
  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Package",
  },
  packageName:{
    type: String,
  },
  invoiceDate:{
    type: String,
  },
  responsibleDep:{
    type: String,
  },
  managerInCharge:{
    type: String,
  },
  startingDate:{
    type: String,
  },
  progress:{
    type: String,
  },
  estDeliveryDate:{
    type: String,
  }

}, {
  timestamps: true
});

// Pre-save hook to generate and assign order number
orderSchema.pre('save', async function(next) {
  try {
    if (!this.isNew || this.orderNo !== '000001') { // Check if it's new or orderNo is already set
      return next();
    }

    let newOrderNo = '000001';

    const lastOrder = await this.constructor.findOne({}, {}, { sort: { 'createdAt': -1 } });
    if (lastOrder && lastOrder.orderNo >= '000001') {
      const lastOrderNo = parseInt(lastOrder.orderNo, 10);
      if (!isNaN(lastOrderNo)) { // Check if conversion to integer was successful
        newOrderNo = (lastOrderNo + 1).toString().padStart(6, '0');
      } else {
        // Handle the case where the conversion failed
        console.error('Failed to parse last order number to integer.');
      }
    }

    this.orderNo = newOrderNo;
    return next();
  } catch (error) {
    return next(error);
  }
});

module.exports = mongoose.model("Order", orderSchema);
