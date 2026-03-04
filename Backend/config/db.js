const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI,{
      family: 4
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error,process.env.MONGO_URI);
    process.exit(1);
  }
};

module.exports = connectDB;