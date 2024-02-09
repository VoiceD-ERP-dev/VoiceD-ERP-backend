const mongoose = require("mongoose");

const salesmanSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
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
},{
    timestamps: true
});

module.exports = mongoose.model("Salesman", salesmanSchema);