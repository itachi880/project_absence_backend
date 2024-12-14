require("dotenv").config();
require("./DataBase")(); // connect to db

console.log("################the .env is " + (process.env.BACKEND_PORT ? " good " : " not loaded") + "####################");
const express = require("express");
const path = require("path");
const cors = require("cors");
const formateurRoute=require("./Routes/formateur/index");
const loginRoute = require("./Routes/Login/index");
const absenceRoute = require("./Routes/Absence/index");
const usersRoute = require("./Routes/Users");
const groupsRoute = require("./Routes/Groups");
const CertificationsRoute = require("./Routes/Certifications");
const { image_profiles_folder } = require("./utils/foldersName");

const server = express();

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use("/login", loginRoute);
server.use("/users", usersRoute);
server.use("/absence", absenceRoute);
server.use("/formateur", formateurRoute);
server.use("/groups", groupsRoute);
server.use("/certifications", CertificationsRoute);
server.get("/profile/:image_name", (req, res) => {
  res.sendFile(path.join(__dirname, image_profiles_folder, req.params.image_name.replaceAll("..", "")), (err) => {
    console.log(err);
    res.status(404).end();
  });
});

server.listen(process.env.BACKEND_PORT || 5000, () => {
  console.log("server running");
});
