const mongoose = require("mongoose");

const customerSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Admin",
    },
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
},{
    timestamps: true
});

module.exports = mongoose.model("Customer", customerSchema);