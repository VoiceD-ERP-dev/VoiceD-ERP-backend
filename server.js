const express = require("express");
const cors = require("cors");
const connectiondb = require("./config/dbConnection");
const dotenv = require("dotenv");
const errorHandler = require("./middleware/errorHandler");
const salesmanRoutes = require("./routes/salesmanRoutes");
const orderRoutes = require("./routes/orderRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const userRoutes = require("./routes/userRoutes");
dotenv.config();
connectiondb();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
    origin: 'https://voice-d-erp-frontend.vercel.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // enable credentials (if needed)
  }));
app.options("*", cors());
app.use("/api/admins", require("./routes/adminRoutes"));
app.use("/api/customers", require("./routes/customerRoutes"));
app.use("/api/salesmen", salesmanRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/users", userRoutes);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});