const asyncHandler = require("express-async-handler");
const Salesman = require("../models/salesmanModel");
const User = require("../models/userModel");
const Admin = require("../models/adminModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
              agentNo:user.agentNo,
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
  

  
//@desc Get all customers
//@route GET /api/customers
//@access private
const getAllUsers = asyncHandler(async (req, res) => {
  const usersWithOtherData = await User.aggregate([
    {
      $lookup: {
        from: 'salesmen', // First lookup attempt
        localField: 'registerId',
        foreignField: '_id',
        as: 'otherData'
      }
    },
    {
      $addFields: {
        otherData: { $ifNull: [ "$otherData", [] ] } // Convert null to empty array if no data found
      }
    },
    {
      $lookup: {
        from: 'admins', // Second lookup attempt
        localField: 'registerId',
        foreignField: '_id',
        as: 'tempData'
      }
    },
    {
      $addFields: {
        tempData: { $ifNull: [ "$tempData", [] ] } // Convert null to empty array if no data found
      }
    },
    {
      $addFields: {
        otherData: { $concatArrays: [ "$otherData", "$tempData" ] } // Concatenate the results of both lookups
      }
    },
    {
      $project: {
        tempData: 0
      }
    }
  ]);

  res.status(200).json(usersWithOtherData);
});





  module.exports = {loginUser,getAllUsers };