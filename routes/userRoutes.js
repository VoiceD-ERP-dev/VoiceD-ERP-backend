const express = require("express");
const { loginUser,getAllUsers } = require("../controllers/userController");


const router = express.Router();

router.post("/login", loginUser);
router.get("/getAll", getAllUsers);

module.exports = router;