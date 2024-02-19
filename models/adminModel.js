const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
    username : {
        type : String,
        required: [true, "Please add the admin name"]
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
    adminRole:{
        type: String,
        required : [true, "please add the admin Role"],
    },
    userId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "userId",
    },
}, 
{
    timestamps: true
});

module.exports = mongoose.model("Admin" , adminSchema);