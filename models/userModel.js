const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: [true, "Please add the user firstname"],
    },
    lastname: {
        type: String,
        required: [true, "Please add the user lastname"],
    },
    username : {
        type : String,
        required: [true, "Please add the Username"]
    },
    email :{
        type : String, 
        required : [true, "Please add a email"],
        //unique : [true, "Email address is already exsit"] 
    },
    password: {
        type: String,
        required : [true, "please add the admin password"],
    },
    role: {
        type: String,
        required : [true, "please add the Role"],
    },
    registerId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "registerId",
    },
}, 
{
    timestamps: true
});

module.exports = mongoose.model("User" , userSchema);