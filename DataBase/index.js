const mongoose = require("mongoose");
const db = mongoose.createConnection(process.env.MONGODB_URL, { dbName: process.env.DB_NAME });
module.exports = db;
