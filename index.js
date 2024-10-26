const express = require("express");
require("dotenv").config();
console.log("the .env is " + (process.env.BACKEND_PORT ? " good " : " not loaded"));
const server = express();

server.listen(process.env.BACKEND_PORT || 5000, () => {
  console.log("server running");
});
