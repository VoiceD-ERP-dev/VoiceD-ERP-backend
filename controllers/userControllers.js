const expressAsyncHandler = require('express-async-handler');
const User = require('../models/userModel'); // Import the User model

const registerUser = expressAsyncHandler(async (req, res) => {
    const { firstName, lastName, email, contact, package, nic } = req.body;

    if (!firstName || !lastName || !email || !contact || !package || !nic) {
        res.status(400);
        throw new Error("All Fields are mandatory!!");
    }

    const userAvailable = await User.findOne({ nic });

    if (userAvailable) {
        res.status(400);
        throw new Error("User Already Exists!!");
    }

    const user = await User.create({
        firstName,
        lastName,
        email,
        contact,
        package,
        nic
    });

    console.log(`User Created: ${user}`);
    res.status(201).json({ message: "User Created Successfully", user });
});


const getUser = expressAsyncHandler(async (req, res) => {
    const nic = req.params.nic; // Access 'nic' parameter from request parameters

    const user = await User.findOne({ nic });

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    // Log the user data
    console.log(`User Retrieved: ${user.firstName} ${user.lastName}`);

    res.status(200).json({ user });
});


module.exports = { registerUser,getUser };
