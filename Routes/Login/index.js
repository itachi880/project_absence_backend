const User = require("../../Models/User");
const { HashPass } = require("../../utils/hashPass");
const { jwt_generator } = require("../../utils/jwt_auth");
const express = require("express");
const router = express.Router();

// all requests start from '/login' exp for / its /login/
router.post("/", async (req, res) => {
  const { password, login } = req.body;
  try {
    if (!login || !password) return res.statusCode(400).end("incompleate request");
    let user = await User.findOne({ login: login, password: HashPass(password), is_deleted: false });
    if (!user) return res.statusCode(404).end("user not found ");
    delete user.password;
    res.json({
      token: jwt_generator({ id: user._id, role: user.role }),
      data: user.toJSON(),
    });
  } catch (e) {
    console.log(e);
    res.statusCode(500).json(e);
  }
});
module.exports = router;
