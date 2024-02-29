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
        //unique : [true, "Username is already taken"]
    },
    email :{
        type : String, 
        required : [true, "Please add an email"],
        //unique : [true, "Email address is already taken"]
    },
    
    password: {
        type: String,
        required : [true, "Please add the admin password"],
    },
    phone: {
        type: String,
        required: [true, "Please add the admin phone number"],
    },

    agentNo : {
        type : String,
        required: [true, "Please add the admin agentNo"],
        //unique : [true, "Agent number is already taken"]
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "userId",
    },
},{
    timestamps: true
});

module.exports = mongoose.model("Salesman", salesmanSchema);
