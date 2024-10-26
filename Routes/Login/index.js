const User = require("../../Models/User");
const router = require("express").Router();
// all requests start from '/login' exp for / its /login/
router.post("/", async (req, res) => {
  res.end("added");
});
module.exports = router;
