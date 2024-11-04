const Group = require("../../Models/Group");
const User = require("../../Models/User");
const { jwt_verify } = require("../../utils/jwt_auth");
const roles = require("../../utils/roles");

const router = require("express").Router();

router.post("/add", async (req, res) => {
  const { name=undefined, study_year = undefined, token = undefined } = req.body;
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
router.delete("/delete", async (req, res) => {
  const { token = false, group_id = false } = req.body;
  if (!token || !group_id) return res.status(400).json({ message: "incoreccte les donnes que vous avez envoyer" });
  const [auth_error, auth_data] = await jwt_verify(token);
  if (auth_error) return res.status(401).json({ message: "token pas valide" });
  if (auth_data.role != roles.general_supervisor) return res.status(401).json({ message: "you dont have access only admins and general supervisor are welcome to perform this actions" });
  try {
    await Group.updateOne({ _id: group_id }, { $set: { is_deleted: true } });
    res.json({ message: `groupe deleted` });
    User.updateMany({ group: group_id }, { $set: { is_deleted: true } });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "db error" });
  }
});
router.put("/update", async (req, res) => {
  const { token = false, group_id = false, updated_data = false } = req.body;
  if (!token || !group_id) return res.status(400).json({ message: "incoreccte les donnes que vous avez envoyer" });
  const [auth_error, auth_data] = await jwt_verify(token);
  if (auth_error) return res.status(401).json({ message: "token pas valide" });
  if (auth_data.role != roles.general_supervisor) return res.status(401).json({ message: "you dont have access only admins and general supervisor are welcome to perform this actions" });
  try {
    res.json(await Group.findByIdAndUpdate(group_id, { $set: updated_data }, { new: true }));
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "db error" });
  }
});
module.exports = router;
