const mongoose = require("mongoose");
require("dotenv").config();
const bcrypt = require("bcryptjs");

const User = require("../models/User");

async function seedUsers(){

 await mongoose.connect(process.env.MONGO_URI,{family:4});

 await User.deleteMany({});

 const opsPassword = await bcrypt.hash("ops123",10);
 const financePassword = await bcrypt.hash("fin123",10);

 await User.insertMany([
  {
   email:"ops@demo.com",
   password:opsPassword,
   role:"OPS"
  },
  {
   email:"finance@demo.com",
   password:financePassword,
   role:"FINANCE"
  }
 ]);

 console.log("Users seeded");

 process.exit();
}

seedUsers();