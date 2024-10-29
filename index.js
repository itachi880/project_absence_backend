require("dotenv").config();
require("./DataBase")(); // connect to db
console.log("the .env is " + (process.env.BACKEND_PORT ? " good " : " not loaded"));
const express = require("express");

const cors = require("cors");

const loginRoute = require("./Routes/Login/email_loginRoute");

const studentRoute = require("./Routes/Students");

const jwt_loginRoute = require("./Routes/Login/jwt_loginRoute");

const server = express();

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.use("/login", loginRoute);
server.use("/auth", jwt_loginRoute);
server.use("/students", studentRoute);

server.listen(process.env.BACKEND_PORT || 5000, () => {
  console.log("server running");
});
