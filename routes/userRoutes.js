const express = require('express')
const {registerUser,getUser} = require('../controllers/userControllers')
const router = express.Router()

router.post("/register",registerUser);
router.get("/:nic",getUser);

module.exports = router;