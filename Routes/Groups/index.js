const Group = require("../../Models/Group");
const User = require("../../Models/User");
const { jwt_verify } = require("../../utils/jwt_auth");
const roles = require("../../utils/roles");

const router = require("express").Router();

router.post("/add", async (req, res) => {
  const { name = undefined, study_year = undefined, token = undefined } = req.body;
  if (!name) return res.status(400).end("data is messing");
  if (!token) return res.status(401).end("token error");
  const [jwt_error, data] = await jwt_verify(token);
  if (jwt_error) return res.status(401).end("token wrong");
  if (data.role != roles.general_supervisor) return res.status(401).end("you dont have access to this action");
  try {
    return res.json(await new Group({ name, study_year: study_year }).save());
  } catch (e) {
    return res.status(500).end("insertion error check logs");
  }
});
router.delete("/delete", async (req, res) => {
  const { token = false, group_id = false } = req.body;
  if (!token || !group_id) return res.status(400).end("incoreccte les donnes que vous avez envoyer");
  const [auth_error, auth_data] = await jwt_verify(token);
  if (auth_error) return res.status(401).end("token pas valide");
  if (auth_data.role != roles.general_supervisor) return res.status(401).end("you dont have access only admins and general supervisor are welcome to perform this actions");
  try {
    await Group.updateOne({ _id: group_id }, { $set: { is_deleted: true } });
    res.end("groupe deleted");
    await User.updateMany({ group: group_id }, { $set: { is_deleted: true } });
  } catch (e) {
    console.log(e);
    return res.status(500).end("db error");
  }
});
router.put("/update", async (req, res) => {
  const { token = false, group_id = false, updated_data = false } = req.body;
  if (!token || !group_id) return res.status(400).end("incoreccte les donnes que vous avez envoyer");
  const [auth_error, auth_data] = await jwt_verify(token);
  if (auth_error) return res.status(401).end("token pas valide");
  if (auth_data.role != roles.general_supervisor) return res.status(401).end("you dont have access only admins and general supervisor are welcome to perform this actions");
  try {
    res.json(await Group.findByIdAndUpdate(group_id, { $set: updated_data }, { new: true }));
  } catch (e) {
    console.log(e);
    return res.status(500).end("db error");
  }
});
router.get("/getByYear", async (req, res) => {
  const { token = false, study_year = false } = req.body;
  if (!token || !study_year) return res.status(400).end("incoreccte les donnes que vous avez envoyer");
  const [auth_error, auth_data] = await jwt_verify(token);
  if (auth_error) return res.status(401).end("token pas valide");
  if (auth_data.role != roles.general_supervisor) return res.status(401).end("you dont have access only admins and general supervisor are welcome to perform this actions");
  try {
    res.json(await Group.find({ is_deleted: false, study_year: study_year }));
  } catch (e) {
    res.status(500).end("db error");
    console.log(e);
  }
});
router.get("/getAll", async (req, res) => {
  const { token = false, archived = false } = req.query;
  if (!token) return res.status(400).end("incoreccte les donnes que vous avez envoyer");
  const [auth_error, auth_data] = await jwt_verify(token);
  if (auth_error) return res.status(401).end("token pas valide");
  if (auth_data.role != roles.general_supervisor) return res.status(401).end("you dont have access only admins and general supervisor are welcome to perform this actions");
  try {
    res.json(await Group.find(!archived ? { is_deleted: false } : {}));
  } catch (e) {
    res.status(500).end("db error");
    console.log(e);
  }
});
router.get("/getByID", async (req, res) => {
  const { token = false, id = false } = req.query;
  if (!token || !id) res.status(400).end("data incompleate");
  const [error_auth, data_auth] = await jwt_verify(token);
  if (error_auth) res.status(401).end("you dont have access");
  if (data_auth.role !== roles.general_supervisor) res.status(401).end("you dont have access");
  try {
    res.json(await Group.findById(id));
  } catch (e) {
    res.status(500).end("error in back end");
  }
});
module.exports = router;
