const asyncHandler = require("express-async-handler");
const Salesman = require("../models/salesmanModel");
const User = require("../models/userModel");
const Admin = require("../models/adminModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


// const loginUser = asyncHandler(async (req, res) => {
//     try {
//       //fetching the email and password from the body
//       const { email, password } = req.body;
//       if (!email || !password) {
//         res.status(400);
//         throw new Error("All fields are mandatory!");
//       }
  
//       //taking the email from the req body and finding it from the db
//       const user = await User.findOne({ email });
//       console.log(user);
  
//       //comparing the entered password with hashed password
//       if (user && (await bcrypt.compare(password, user.password))) {
//         const accessToken = jwt.sign(
//           {
//             //payload
//             user: {
//               name: user.name,
//               role: user.role,
//               email: user.email,
//               id: user.id,
//             },
//           },
//           //access token secret
//           process.env.ACCESS_TOKEN_SECRET,
//           //expiration date
//           { expiresIn: "15m" }
//         );
//         console.log(process.env.ACCESS_TOKEN_SECRET);
//         res.status(200).json({ accessToken });
//       } else {
//         res.status(401);
//         throw new Error("Email or password is not valid");
//       }
//     } catch (error) {
//       // Handle any errors that occur
//       console.error(error);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   });
  


const loginUser = asyncHandler(async (req, res) => {
    try {
      //fetching the email and password from the body
      const { username, password } = req.body;
      if (!username || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!");
      }
  
      //taking the email from the req body and finding it from the db
      const user = await User.findOne({ username });
      console.log(user);
  
      
      // Check if the user exists
      if (!user) {
        res.status(404);
        throw new Error("User not found");
      }
  
      //comparing the entered password with hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        const accessToken = jwt.sign(
          {
            //payload
            user: {
              firstname: user.firstname,
              lastname: user.lastname,
              username: user.username,
              role: user.role,
              email: user.email,
              id: user._id,
              registerId : user.registerId,
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
        throw new Error("Invalid password");
      }
    } catch (error) {
      // Handle any errors that occur
      console.error(error);
      res.status(500).json({ message: "Invalid Login Details. Please try again!" });
    }
  });
  
  
  module.exports = {loginUser };