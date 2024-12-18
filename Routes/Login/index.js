const User = require("../../Models/User");
const { HashPass } = require("../../utils/hashPass");
const { jwt_generator, jwt_verify } = require("../../utils/jwt_auth");
const express = require("express");
const router = express.Router();

// all requests start from '/login' exp for / its /login/
router.post("/email", async (req, res) => {
  const { password, login } = req.body;
  try {
    if (!login || !password) return res.status(400).end("incompleate request");
    let user = await User.findOne({ login: login, password: HashPass(password), is_deleted: false }, { displine_points: 0 });
    if (!user) return res.status(404).end("user not found ");
    res.json({
      token: jwt_generator({ id: user._id, role: user.role }),
      data: user.toJSON(),
    });
  } catch (e) {
    console.log(e);
    res.status(500).end("error in server please retry later");
  }
});
router.post("/token", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1] || req.body.token; // can be sent as a part of body data or a hedear with prefix barer
  if (!token) return res.status(401).end("Token non fourni");
  const [error, data] = await jwt_verify(token);
  // Si le token est invalide ou expiré
  if (error) return res.status(401).end("Token invalide ou expiré");
  // Si le token est valide, renvoie les données extraites
  try {
    const userData = await User.findById(data.id, { displine_points: 0 });
    if (!userData) return res.status(404).end("id incorrect");
    res.json({ data: userData.toJSON() });
  } catch (e) {
    res.status(500).end("error in server check logs");
  }
});
module.exports = router;
