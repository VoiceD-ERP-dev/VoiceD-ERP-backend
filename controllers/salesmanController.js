const asyncHandler = require("express-async-handler");
const Salesman = require("../models/salesmanModel");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createsalesman = asyncHandler(async (req, res) => {
  const { firstname, lastname, username, email, password, phone, agentNo } = req.body;

  if (!firstname || !lastname || !username || !email || !password || !phone  || !agentNo) {
    return res.status(400).json({ message: "All fields are mandatory" });
  }

  // Hashing the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Check if the user making the request is an admin
  if (req.user.role === "admin") {
    // Create a new salesman
    const salesman = await Salesman.create({
      firstname,
      lastname,
      username,
      email,
      password: hashedPassword,
      phone,
      agentNo,
      admin_id: req.user.id, // Assuming you have admin_id in your Salesman schema
    });


    // Create a new user associated with the salesman
    const user = await User.create({
      firstname,
      lastname,
      username,
      email,
      password: hashedPassword,
      role: "sales",
      registerId: salesman._id,
    });

    // Link the user ID to the salesman
    salesman.userId = user._id;
    await salesman.save();

    res.status(201).json(salesman);
  } else {
    res.status(400);
    throw new Error("Not an authorized user");
  }
});



//@desc Login a user
//@routs POST /api/salesmen/login
//@access public
const loginsalesman = asyncHandler(async(req, res) => {
    //fetching the email and password from the body
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }

    
    //taking the email from the req body and finding it from the db
    const salesman = await Salesman.findOne({ username });
    console.log(salesman);

    //comparing the entered password with hashed password
    if (salesman && (await bcrypt.compare(password, salesman.password))) {
        
        const accessToken = jwt.sign(
          
            {
              //payload
              user: {
                firstname: salesman.firstname,
                lastname: salesman.lastname,
                username: salesman.username,
                role: "sales",
                email: salesman.email,
                id: salesman.id,
              },
            },
            //access token secret
            process.env.ACCESS_TOKEN_SECRET,
            //expiration date
            { expiresIn: "15m" }
        );
        console.log(process.env.ACCESS_TOKEN_SECRET);
        res.status(200).json({ accessToken });
    } else {
        res.status(401);
        throw new Error("Email or password is not valid");
    }
});

  
  module.exports = { createsalesman, loginsalesman };