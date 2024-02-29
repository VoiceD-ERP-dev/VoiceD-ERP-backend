const mongoose = require("mongoose");

const salesmanSchema = mongoose.Schema({
    admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Admin",
    },
    firstname: {
        type: String,
        required: [true, "Please add the admin firstname"],
    },
    lastname: {
        type: String,
        required: [true, "Please add the admin lastname"],
    },
    username : {
        type : String,
        required: [true, "Please add the admin username"],
        unique : [true, "Email address is already exsit"]
    },
    email :{
        type : String, 
        required : [true, "Please add a email"],
        unique : [true, "Email address is already exsit"]
    },
    password: {
        type: String,
        required : [true, "please add the admin password"],
    },
    phone: {
        type: String,
        required: [true, "Please add the admin phone number"],
    },
    agentNo : {
        type : String,
        required: [true, "Please add the admin agentNo"],
        unique : [true, "This agentNo is already exsit"]
    },
    
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "userId",
    },
},{
    timestamps: true
});

module.exports = mongoose.model("Salesman", salesmanSchema);