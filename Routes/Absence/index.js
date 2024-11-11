const Absence = require("../../Models/Absence");
const { jwt_verify } = require("../../utils/jwt_auth");
const roles = require("../../utils/roles");

const router = require("express").Router();

router.get("/getByID", async (req, res) => {
  const { token = false, id = false } = req.query;
  if (!token || !id) return res.status(400).json({ message: "data incompleate" });
  const [auth_error, auth_data] = await jwt_verify(token);
  if (auth_error) return res.status(401).json({ message: "you don't have access" });
  try {
    const doc = await Absence.findById(id);
    if (!doc) return res.status(404).json({ message: "not found" });
    if (doc.student_id !== auth_data.id && auth_data.role !== roles.general_supervisor) return res.status(401).json({ message: "you dont have access to this data" });
    return res.json(doc);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "error in server",
    });
  }
});
module.exports = router;
