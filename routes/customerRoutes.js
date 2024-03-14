const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {  
    getCustomers,
    getAllCustomers,
    createCustomer,
    getCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerbyContact,
    downloadDocs
} = require("../controllers/customerController");
const validateToken = require("../middleware/validateTokenHandler");

router.route("/all").get(getAllCustomers);
router.route("/download/:filename").get(downloadDocs);
//once you made all the customer routes private it should be validated
//using the validateToken middle weare to validate the route
router.use(validateToken);   //this will walidate all the rutes
router.route("/cv").get(getCustomers).post(upload.fields([
    { name: 'nicDoc', maxCount: 10 },
    { name: 'brDoc', maxCount: 10 },
    { name: 'otherDoc', maxCount: 10 }
]), createCustomer);
router.route("/search/:id").get(getCustomer);
router.route("/update/:id").patch(updateCustomer).delete(deleteCustomer);
router.route("/findbyPhone/:id").get(getCustomerbyContact);
module.exports = router;