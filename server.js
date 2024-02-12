const express = require("express");
const connectiondb = require("./config/dbConnection");
const dotenv = require("dotenv");
const errorHandler = require("./middleware/errorHandler");
const salesmanRoutes = require("./routes/salesmanRoutes");
const orderRoutes = require("./routes/orderRoutes");

dotenv.config();
connectiondb();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/admins", require("./routes/adminRoutes"));
app.use("/api/customers", require("./routes/customerRoutes"));
app.use("/api/salesmen", salesmanRoutes);
app.use("/api/orders", orderRoutes);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});