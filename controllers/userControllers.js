const expressAsyncHandler = require('express-async-handler');
const User = require('../models/userModel');


const registerUser = expressAsyncHandler(async(req,res)=>{

    const {firstName, lastName, email, contact, package, nic} = req.body;

    if(!firstName || !lastName || !email || !contact || !package || !nic){
        res.status(400);
        throw new Error("All Fields are mandatory!!")
    } 

    const userAvaliable = await User.findOne ({nic});

    if(userAvaliable){
        res.status(400)
        throw new Error("User Already Exists!!")
    }

    const user = await User.create({
        firstName,
        lastName,
        email,
        contact,
        package,
        nic
    });

    console.log(`User Created ${user}`);

})

module.exports = {registerUser}