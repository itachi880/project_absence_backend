const mongoose = require("mongoose");

const connectDB = async (timesOfTrying = 0) => {
  try {
    await mongoose.connect(process.env.MONGODB_URL_TEST, {
      dbName: process.env.DB_NAME,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error.reason);
  }
};

module.exports = connectDB;
