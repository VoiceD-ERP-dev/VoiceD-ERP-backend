const express = require("express");
const dotenv = require("dotenv"); // Import the 'dotenv' library
const connectiondb = require("./config/dbConnection");
const cors = require('cors')

dotenv.config();
connectiondb();


const app = express();
app.use(cors())
const port = process.env.PORT || 5000

app.use(express.json());
app.use("/api/users" , require("./routes/userRoutes"))

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  