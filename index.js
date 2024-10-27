
require("dotenv").config(); 
require("./DataBase")(); // connect to db
console.log("the .env is " + (process.env.BACKEND_PORT ? " good " : " not loaded"));
const express = require("express");
const loginRoute = require("./Routes/Login");
const studentRoute = require("./Routes/Students");
const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use("/login", loginRoute);
server.use("/students", studentRoute);

server.listen(process.env.BACKEND_PORT || 5000, () => {
  console.log("server running");
});