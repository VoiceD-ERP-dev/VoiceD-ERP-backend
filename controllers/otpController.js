const express = require("express");
const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const sendSMS = require("../config/otpSender");
dotenv.config();

// Array to store OTP data for multiple phone numbers
let otpDataArray = [];

// Function to generate OTP
const generateOTP = (req, res) => {
    const { phoneNo } = req.body;
    console.log("Phone: " + phoneNo);

    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    
    // Store OTP data for the current phone number
    otpDataArray.push({
        phoneNo: phoneNo,
        otp: OTP,
        creationTime: new Date()
    });

    sendSMS(
        process.env.TWILIO_PHONE_NUMBER,
        phoneNo,
        `Your OTP is: ${OTP}`
    );

    res.status(200).json({ otp: OTP });
};


const compareOTP = (req, res) => {
    const { userOTP, phoneNo } = req.body;

    // Find index of OTP data for the provided phone number
    const otpDataIndex = otpDataArray.findIndex(data => data.phoneNo === phoneNo);

    if (otpDataIndex === -1) {
        // Phone number not found in OTP data array
        res.status(400).json({ message: "Phone number not found" });
        return;
    }

    // Get OTP data for the provided phone number
    const otpData = otpDataArray[otpDataIndex];

    // Check if OTP is expired
    const currentTime = new Date();
    const timeDifference = currentTime - otpData.creationTime;
    const expirationTime = 15 * 1000; // 5 minutes in milliseconds

    if (timeDifference > expirationTime) {
        // OTP is expired
        otpDataArray.splice(otpDataIndex, 1); // Remove expired OTP data
        res.status(400).json({ message: "OTP is expired" });
        return;
    }


    // Retrieve stored OTP for the provided phone number
    const storedOTP = otpData.otp;

    if (userOTP === storedOTP) {
        // OTP is correct
        otpDataArray.splice(otpDataIndex, 1); // Remove OTP data after successful validation
        res.status(200).json({ message: "Mobile Number Verified" });
    } else {
        // OTP is incorrect
        res.status(401).json({ message: "OTP is incorrect" });
    }
};

module.exports = { generateOTP, compareOTP };
