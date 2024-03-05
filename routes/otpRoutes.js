const express = require("express");
const router = express.Router();
const { generateOTP, compareOTP } = require("../controllers/otpController");

router.post("/sendopt", generateOTP);
router.post("/compareotp", compareOTP);
module.exports = router;