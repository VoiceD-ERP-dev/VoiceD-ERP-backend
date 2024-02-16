const asyncHandler = require("express-async-handler");
const Salesman = require("../models/salesmanModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createsalesman = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are mandatory" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  if(req.user.role == "admin"){
    const salesman = await Salesman.create({
      name,
      email,
      password: hashedPassword,
      user_id: req.user.id,
    });
    
    res.status(201).json(salesman);
  }
  else{
    res.status(400);
    throw new Error("Not an authorized user");
  }
  });

//@desc Login a user
//@routs POST /api/salesmen/login
//@access public
const loginsalesman = asyncHandler(async(req, res) => {
    //fetching the email and password from the body
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }

    
    //taking the email from the req body and finding it from the db
    const salesman = await Salesman.findOne({ email });
    console.log(salesman);

    //comparing the entered password with hashed password
    if (salesman && (await bcrypt.compare(password, salesman.password))) {
        
        const accessToken = jwt.sign(
          
            {
                //payload
                user: {
                    name: salesman.name,
                    role: "salesman",
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