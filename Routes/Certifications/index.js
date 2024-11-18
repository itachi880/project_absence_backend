const Certification = require("../../Models/Certification");
const { jwt_verify } = require("../../utils/jwt_auth");
const roles = require("../../utils/roles");

const router = require("express").Router();
router.get("/getByID", async (req, res) => {
  const { token = false, id = false } = req.query;
  if (!token || !id) return res.status(400).end("data incompleat");
  const [auth_error, auth_data] = await jwt_verify(token);
  if (auth_error) return res.status(401).end("token error");
  if (auth_data.role == roles.general_supervisor) return res.json(await Certification.findById(id));
  return res.json(await Certification.findOne({ _id: id, student_id: auth_data.id }));
});
router.put("/validate", async (req, res) => {
  const { token = false, id = false, status = false } = req.query;
  if (!token || !id || !status) return res.status(400).end("data incompleate");
  const [auth_error, auth_data] = await jwt_verify(token);
  if (auth_error || auth_data.role != roles.general_supervisor) return res.status(401).end("token error (access denide)");
  try {
    await Certification.updateOne({ _id: id }, { status: status });
    return res.end("done");
  } catch (e) {
    console.log(e);
    return res.status(500).end("error server");
  }
});

module.exports = router;
