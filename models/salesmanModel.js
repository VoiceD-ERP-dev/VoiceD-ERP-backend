const mongoose = require("mongoose");

const salesmanSchema = mongoose.Schema({
    admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Admin",
      },
    name: {
        type: String,
        required: [true, "Please add the contact name"],
    },
    email: {
        type: String,
        required: [true, "Please add the contact email address"],
    },
    password: {
        type: String,
        required: [true, "Please add the password"],
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "userId",
    },
},{
    timestamps: true
});

module.exports = mongoose.model("Salesman", salesmanSchema);