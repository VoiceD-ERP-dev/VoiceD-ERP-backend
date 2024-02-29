const asyncHandler = require("express-async-handler");
const Admin = require("../models/adminModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//@desc Register a admin
//@routs POST /api/admins/register
//@access public
const registerAdmin = asyncHandler(async(req,res) =>{
  //destructuring the request body sent from the client side
  const { firstname,lastname,username, email, password,phone,epfRegNo,agentNo, adminRole } = req.body;
  
    //checking weather the fileds are empty
    if(!username || !email || !password || !adminRole || !firstname || !lastname || !phone || !epfRegNo || !agentNo){
        res.status(400);
        throw new Error("All fields are mandatory!");
    }

    //checking weather the email is already exist
    const userAvailable = await Admin.findOne( {username} );
    if(userAvailable){
        res.status(400);
        throw new Error("Admin alerady registered");
    }

    //encrypting the password using bcrypt lib
    //creating a hashed password
    //the two pars of this method are pw and number of salt rounds
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password :" , hashedPassword); 

    //create a new admin
    const admin = await Admin.create({
      firstname,
      lastname,
      username,
      email,
      password : hashedPassword,
      phone,
      epfRegNo,
      agentNo,
      adminRole
    });
    const user = await User.create({
      firstname,
      lastname,
      username,
      email,
      password : hashedPassword,
      role: "admin",
      registerId: admin._id
    });

    admin.userId=user._id
    await admin.save();

    console.log(`Admin created ${admin}`);
    console.log(`Admin created ${user}`);

    //if admin is successfully created send the info to the admin
    if(admin){
        res.status(201).json({ 
            _id : admin.id,
            username:admin.username
        });
        }else{
        res.status(400);
        throw new Error("Admin data not valid");
        }
        res.json({message: "Register the admin"});
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