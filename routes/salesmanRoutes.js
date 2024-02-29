const express = require("express");
const { createsalesman, loginsalesman ,getAllSalesmen} = require("../controllers/salesmanController");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

router.post("/register", validateToken, createsalesman);
router.post("/login", loginsalesman);
router.get("/getAllSalesmen", validateToken, getAllSalesmen);
module.exports = router;


