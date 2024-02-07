const express = require("express");
const connectiondb = require("./config/dbConnection");
const dotenv = require("dotenv"); // Import the 'dotenv' library
const errorHandler = require("./middleware/errorHandler");

dotenv.config();
connectiondb();


const app = express();
const port = process.env.PORT || 5000




app.use(express.json());  //this an inbulid middleware -> this provide a passer which will pass the data that we recive from the client on the server
app.use("/api/admins", require("./routes/adminRoutes"));



app.use("/api/users" , require("./routes/userRoutes"))
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  