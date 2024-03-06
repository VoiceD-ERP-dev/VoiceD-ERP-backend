const express = require("express");
const { completeOrder } = require("../controllers/orderController");
const router = express.Router();

router.patch("/:id/complete", completeOrder);


module.exports = router;
