const mongoose = require("mongoose");

const packageSchema = mongoose.Schema({
  invoice: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Invoice",
  },
  package: {
    type: String,
    required: true,
  },
  startupFee: {
    type: String,
    required: true,
  },

}, {
  timestamps: true
});

module.exports = mongoose.model("Package", packageSchema);