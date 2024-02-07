const express = require("express");
const dotenv = require("dotenv"); // Import the 'dotenv' library
const connectiondb = require("./config/dbConnection");


dotenv.config();
connectiondb();


const app = express();
const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  