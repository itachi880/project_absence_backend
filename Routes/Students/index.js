const path = require("path");
const User = require("../../Models/User");
const file_uploader = require("../../utils/file_uploader");
const { HashPass } = require("../../utils/hashPass");
const { jwt_verify } = require("../../utils/jwt_auth");
const roles = require("../../utils/roles");
const fs = require("fs");
const { image_profiles_folder } = require("../../utils/foldersName");
const Group = require("../../Models/Group");
const router = require("express").Router();
// inscription from idara o l7irassa
router.get("/getByID", async (req, res) => {
  const { token = false, id = false } = req.query; // can be sent as a part of body data or a hedear with prefix barer
  if (!token || !id) return res.status(400).end("data incomplet");
  const [error, data] = await jwt_verify(token);
  // Si le token est invalide ou expiré
  if (error) return res.status(401).end("Token invalide ou expiré");
  if (data.id !== id && data.role != roles.general_supervisor) return res.status(401).end("you dont have access to this action");
  // Si le token est valide, renvoie les données extraites
  try {
    const userData = await User.findById(id);
    if (!userData) return res.status(404).end("id incorrect");
    res.json({ data: userData.toJSON() });
  } catch (e) {
    res.status(500).end("error in server check logs");
  }
});
router.get("/getByGroupID", async (req, res) => {
  const { token = false, id = false } = req.query; // can be sent as a part of body data or a hedear with prefix barer
  if (!token || !id) return res.status(400).end("data incomplet");
  const [error, data] = await jwt_verify(token);
  // Si le token est invalide ou expiré
  if (error) return res.status(401).end("Token invalide ou expiré");
  if (data.role != roles.general_supervisor) return res.status(401).end("you dont have access to this action");
  // Si le token est valide, renvoie les données extraites
  try {
    const userData = await User.find({ group: id });
    if (!userData) return res.status(404).end("id incorrect");
    res.json({ data: userData });
  } catch (e) {
    console.log(e);
    res.status(500).end("error in server check logs");
  }
});

router.post("/add", async (req, res) => {
  const { token = false, first_name = false, last_name = false, cin = false, login = false, password = false, group = null, role = roles.student } = req.body;

  const [auth_error, auth_data] = await jwt_verify(token);

  if (auth_error) return res.status(401).end("token pas valide");
  if (auth_data.role != roles.general_supervisor) return res.status(401).end("you dont have access only admins and general supervisor are welcome to perform this actions");
  if (!first_name || !last_name || !cin || !login || !password) return res.status(400).end("data incompleate");

  try {
    if (role == roles.student) if (!(await Group.findOne({ _id: group, is_deleted: false }))) return res.status(404).end("no group was found");
    res.json((await new User({ first_name, last_name, cin, login, password: HashPass(password), group: group, profile: null, role }).save()).toJSON());
  } catch (e) {
    console.log(e);
    res.status(500).end("check errors in logs");
  }
});
router.put("/modify", file_uploader.single("profile_pic"), async (req, res) => {
  let { student_id, token, updated_data } = req.body;
  if (!student_id || !token) return res.status(400).end("data is messing");
  try {
    updated_data = JSON.parse(updated_data);
  } catch (parseError) {
    console.error("JSON parse error:", parseError);
    return res.status(400).end("Invalid JSON format in updated_data");
  }
  const [jwt_error, data] = await jwt_verify(token);
  if (jwt_error) return res.status(400).end("token error");
  if (data.role !== roles.general_supervisor && data.id !== student_id) return res.status(401).end("you dont have access to this action");
  if (req.file) {
    const filename = student_id + req.file.originalname;
    fs.writeFile(path.join(__dirname, "..", "..", image_profiles_folder, filename), req.file.buffer, {}, (err) => {
      console.log(err);
    });
    updated_data.profile = filename;
  }
  try {
    res.json(await User.findByIdAndUpdate(student_id, updated_data, { new: true }));
  } catch (e) {
    console.log(e);
    return res.status(500).end("data base error");
  }
});
router.delete("/delete", async (req, res) => {
  const { token = false, student_id = false } = req.body;
  if (!token || !student_id) return res.status(400).end("incoreccte les donnes que vous avez envoyer");

  const [auth_error, auth_data] = await jwt_verify(token);

  if (auth_error) return res.status(401).end("token pas valide");
  if (auth_data.role != roles.general_supervisor) return res.status(401).end("you dont have access only admins and general supervisor are welcome to perform this actions");

  try {
    await User.updateOne({ _id: student_id }, { $set: { is_deleted: true } });
    return res.end("etudiant suprimer avec sucses");
  } catch (e) {
    console.log(e);
    return res.status(500).end("db error");
  }
});
module.exports = router;
