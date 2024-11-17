const mongoose = require("mongoose");

const connectDB = async (useLocal) => {
  useLocal && console.warn("faild to use the online db swich to test db");
  try {
    await mongoose.connect(useLocal ?? process.env.MONGODB_URL, {
      dbName: process.env.DB_NAME,
      maxIdleTimeMS: 2000,
      connectTimeoutMS: 4000,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error.reason ?? error);
    useLocal !== process.env.MONGODB_URL_TEST && connectDB(process.env.MONGODB_URL_TEST);
  }
};

module.exports = connectDB;
