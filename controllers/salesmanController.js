const asyncHandler = require("express-async-handler");
const Salesman = require("../models/salesmanModel");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendSales = require('../config/salesMaliSender');
const createsalesman = async (req, res) => {
  try {
      const { firstname, lastname, username, email, password, phone, agentNo } = req.body;

      if (!firstname || !lastname || !username || !email || !password || !phone  || !agentNo) {
          return res.status(400).json({ message: "All fields are mandatory" });
      }

      // Hashing the password
      const hashedPassword = await bcrypt.hash(password, 10);

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
      const pdfSent = await sendSales(firstname, lastname, email, username, password, phone, agentNo);
      if(!pdfSent){
        throw new Error("Failed to send PDF via email!!")
      }
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
        } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: "Internal server error" });
  }
};



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

//@desc Get all salesmen associated with a specific user
//@route GET /api/salesmen/:userId
//@access private
const getAllSalesmen = asyncHandler(async (req, res) => {
    const admin = req.params.role;

    // Fetching all salesmen associated with the specified user ID
    const salesmen = await Salesman.find();

    if (!salesmen || salesmen.length === 0) {
        res.status(404);
        throw new Error("No salesmen found for the specified user");
    }

    res.status(200).json(salesmen);
});

//@desc Get new customers
//@route GET /api/customers/:id
//@access private
const getseller = asyncHandler(async (req, res) => {
  //getting the customer by id
  const salesman = await Salesman.findById(req.params.id);
  if(!salesman) {
    res.status(404);
    throw new Error("Customer not found");
  }

  res.status(200).json(salesman);
});
  module.exports = { createsalesman, loginsalesman,getAllSalesmen,getseller };