require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoute");
const vendorRoutes = require("./routes/vendorRoutes");

const app = express()
connectDB();

app.use(cors());
app.use(express.json());

app.use("/auth",authRoutes);
app.use("/vendors",vendorRoutes);

app.listen(process.env.PORT,()=>{
 console.log(`Server running on port ${process.env.PORT}`);
});