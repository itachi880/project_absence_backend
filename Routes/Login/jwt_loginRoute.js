const express = require("express");
const router = express.Router();
const { jwt_verify } = require("../../utils/jwt_auth");
const User = require("../../Models/User");

// Route d'authentification
router.post("/", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1] || req.body.token; // can be sent as a part of body data or a hedear with prefix barer
  if (!token) return res.status(401).json({ message: "Token non fourni" });
  const [error, data] = await jwt_verify(token);
  // Si le token est invalide ou expiré
  if (error) return res.status(401).json({ message: "Token invalide ou expiré" });
  // Si le token est valide, renvoie les données extraites
  try {
    const userData = await User.findById(data.id);
    if (!userData) return res.status(404).json({ message: "id incorrect" });
    res.status(200).json({ message: "Authentification réussie", data: userData.toJSON() });
  } catch (e) {
    res.status(500).json({ message: "error in server check logs" });
  }
});

module.exports = router;
