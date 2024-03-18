const asyncHandler = require("express-async-handler");
const Admin = require("../models/adminModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//@desc Register a admin
//@routs POST /api/admins/register
//@access public
const registerAdmin = asyncHandler(async (req, res) => {
  try {
      // Destructuring the request body sent from the client side
      const { firstname, lastname, username, email, password, phone, agentNo, adminRole } = req.body;

      // Checking whether the fields are empty
      if (!username || !email || !password || !adminRole || !firstname || !lastname || !phone || !agentNo) {
          res.status(400);
          throw new Error("All fields are mandatory!");
      }

      // Checking whether the username is already taken
      const userAvailable = await Admin.findOne({ username });
      if (userAvailable) {
          res.status(400);
          throw new Error("Admin already registered");
      }

      // Encrypting the password using bcrypt library
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("Hashed password:", hashedPassword);

      // Create a new admin
      const admin = await Admin.create({
          firstname,
          lastname,
          username,
          email,
          password: hashedPassword,
          phone,
          agentNo,
          adminRole
      });

      // Create a corresponding user
      const user = await User.create({
          firstname,
          lastname,
          username,
          email,
          password: hashedPassword,
          role: adminRole,
          agentNo,
          registerId: admin._id
      });

      admin.userId = user._id;
      await admin.save();

      console.log(`Admin created: ${admin}`);
      console.log(`User created: ${user}`);

      // If admin is successfully created, send the info to the client
      if (admin) {
          res.status(201).json({
              _id: admin.id,
              username: admin.username
          });
      } else {
          res.status(400);
          throw new Error("Admin data not valid");
      }
  } catch (error) {
      console.error('Error in registerAdmin:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

//@desc Login a admin
//@routs POST /api/admins/login
//@access public
const loginAdmin = asyncHandler(async(req,res) =>{
      //fetching the email and password from the body
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }

  //taking the emain from the req body and finding it from the db
  const admin = await Admin.findOne({ username });
  console.log(admin);

  //comparing the entered pw with hashedpassword
  if (admin && (await bcrypt.compare(password, admin.password))) {
    const accessTocken = jwt.sign(
      {
        //payload
        user: {
          firstname: admin.firstname,
          lastname: admin.lastname,
          username: admin.username,
          role: "admin",
          email: admin.email,
          id: admin.id,
        },
      },
      //access token secreat
      process.env.ACCESS_TOKEN_SECRET,
      //experation date
      { expiresIn: "15m" }
    );
    console.log(process.env.ACCESS_TOKEN_SECRET);
    res.status(200).json({ accessTocken });
  } else {
    res.status(401);
    throw new Error("email or password is not valid");
  }
    res.json({message: "login admin"});
});

//@desc Current admin info
//@routs GET /api/admins/current
//@access private
const currentAdmin = asyncHandler(async (req, res) => {
    res.json(req.admin);
  });

module.exports = { registerAdmin , loginAdmin , currentAdmin};