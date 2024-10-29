const express = require("express");
const router = express.Router();
const { jwt_verify } = require("../../utils/jwt_auth");

// Route d'authentification
router.post("/", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1] || req.body.token;
    if (!token) {
        return res.status(401).json({ message: "Token non fourni" });
    }

    // Vérifier le token avec la fonction jwt_verify
    const [error, data] = await jwt_verify(token);

    if (error) {
        // Si le token est invalide ou expiré
        return res.status(401).json({ message: "Token invalide ou expiré", error: error.message });
    }

    // Si le token est valide, renvoie les données extraites
    res.status(200).json({ message: "Authentification réussie", data });
});

module.exports = router;
