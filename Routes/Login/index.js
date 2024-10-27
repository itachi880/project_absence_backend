const User = require("../../Models/User");
const { jwt_verify } = require("../../utils/jwt_auth");
const roles = require("../../utils/roles");
const router = require("express").Router();

// all requests start from '/login' exp for / its /login/

router.post("/", (req, res) => {});
module.exports = router;
