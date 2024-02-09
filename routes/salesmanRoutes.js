const express = require("express");
const { createsalesman, loginsalesman } = require("../controllers/salesmanController");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

router.post("/register", validateToken, createsalesman);
router.post("/login", loginsalesman);

module.exports = router;


