const asyncHandler = require("express-async-handler");
const  Customer = require("../models/customerModel")
//@desc Get all customers
//@route GET /api/customers
//@access private
const getCustomers = asyncHandler(async (req, res) => {    //async makes a function return a Promise
  //getting the customers from the db
  //getting all the customers created by the login in admin
  const customers = await Customer.find({ user_id: req.admin.id });  //await makes a function wait for a Promise
    res.status(200).json(customers);
  });

//@desc Post customer by id
//@routs POST /api/customers/
//@access private
const createCustomer = asyncHandler(async (req, res) => {
    //printing the request body
    console.log("The request body is : ", req.body);
  
    //destructuring the request body sent from the client side
    const { name, email, phone } = req.body;
  
    //validating the name,email and phone and displaying the error message
    if (!name || !email || !phone) {
      res.status(400);
      throw new Error("All fields are mandatory");
    }
    if(req.user.role == "admin" || "salesman"){
      const customer = await Customer.create({
        name, //equls to request.body.name. in es6 key and value is same we can use key
        email,
        phone,
        user_id: req.user.id, //req.admin will come from the middleware
  
      });
      res.status(201).json(customer);
    }
    else{
      res.status(400);
      throw new Error("Not an authorized user");
    }
  });

//@desc Get new customers
//@route GET /api/customers/:id
//@access private
const getCustomer = asyncHandler(async (req, res) => {
    //getting the customer by id
    const customer = await Customer.findById(req.params.id);
    if(!customer) {
      res.status(404);
      throw new Error("Customer not found");
    }

    res.status(200).json(customer);
  });
//@desc Update all customers
//@route UPDATE /api/customers/:id
//@access private
const updateCustomer = asyncHandler(async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if(!customer) {
      res.status(404);
      throw new Error("Customer not found");
    }
    //checking weather the admin id of the login admin is matching with the updating customer
    if (customer.user_id.toString() !== req.admin.id) {
      res.status(402);
      throw new Error("User don't have permission to update this");
    }
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id, //getting the id of the customer that needs to be updated
      req.body, //getting the updated body
      { new: true } //query option
    );
  
  
    res.status(200).json(updatedCustomer);
  });


//@desc Delete a customer
//@routs DELETE /api/customers/:id
//@access private
const deleteCustomer = asyncHandler(async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if(!customer) {
      res.status(404);
      throw new Error("Customer not found");
    }
    //checking weather the admin id of the login admin is matching with the deleting customer
    if (customer.user_id.toString() !== req.admin.id) {
      res.status(402);
      throw new Error("User don't have permission to update this");
    }

    await Customer.deleteOne({ _id: req.params.id });
    res.status(200).json(customer); 
  });

module.exports = {
    getCustomers,
    createCustomer,
    getCustomer,
    updateCustomer,
    deleteCustomer,
    
  };