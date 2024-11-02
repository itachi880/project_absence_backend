const Group = require("../../Models/Group");
const { jwt_verify } = require("../../utils/jwt_auth");
const roles = require("../../utils/roles");

const router = require("express").Router();

router.post("/add", async (req, res) => {
  const { name, study_year = undefined, token = undefined } = req.body;
  if (!name) return res.status(400).json({ message: "data is messing " });
  if (!token) return res.status(401).json({ message: "token error" });
  const [jwt_error, data] = await jwt_verify(token);
  if (jwt_error) return res.status(401).json({ message: "token wrong" });
  if (data.role !== roles.general_supervisor) return res.status(401).json({ message: "you dont have access to this action" });
  try {
    return res.json(await new Group({ name, study_year: study_year }).save());
  } catch (e) {
    return res.status(500).json({ message: "insertion error check logs" });
  }
});

module.exports = router;
