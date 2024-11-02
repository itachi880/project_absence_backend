const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL_TEST, {
      dbName: process.env.DB_NAME,
      maxIdleTimeMS: 2000,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error.reason);
  }
};

module.exports = connectDB;
