const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {  
    getCustomers,
    createCustomer,
    getCustomer,
    updateCustomer,
    deleteCustomer,
} = require("../controllers/customerController");
const validateToken = require("../middleware/validateTokenHandler");

//once you made all the customer routes private it should be validated
//using the validateToken middle weare to validate the route
router.use(validateToken);   //this will walidate all the rutes
router.route("/cv").get(getCustomers).post(upload.fields([
    { name: 'nicDoc', maxCount: 10 },
    { name: 'brDoc', maxCount: 10 },
    { name: 'otherDoc', maxCount: 10 }
]), createCustomer);
router.route("/:id").get(getCustomer).put(updateCustomer).delete(deleteCustomer);


module.exports = router;