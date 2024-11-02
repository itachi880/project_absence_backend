const path = require("path");
const User = require("../../Models/User");
const file_uploader = require("../../utils/file_uploader");
const { HashPass } = require("../../utils/hashPass");
const { jwt_verify } = require("../../utils/jwt_auth");
const roles = require("../../utils/roles");
const fs = require("fs");
const router = require("express").Router();
// inscription from idara o l7irassa
router.post("/add", async (req, res) => {
  const { token = false, first_name = false, last_name = false, cin = false, login = false, password = false, group = null } = req.body;

  const [auth_error, auth_data] = await jwt_verify(token);

  console.log(auth_error);
  if (auth_error) return res.status(401).json({ message: "token pas valide" });
  if (auth_data.role != roles.general_supervisor) return res.status(401).json({ message: "you dont have access only admins and general supervisor are welcome to perform this actions" });
  if (!first_name || !last_name || !cin || !login || !password) return res.status(400).json({ message: "data incompleate", data: { first_name, last_name, cin, login, password } });

  try {
    res.json((await new User({ first_name, last_name, cin, login, password: HashPass(password), group: group, profile: null }).save()).toJSON());
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "check errors in logs" });
  }
}); /*
    data to sent as updated sholde look like this (you dont have to send all that just the modified parts)
  {
    "first_name": "John",
    "last_name": "Doe",
    "login": "string(email)",
    "password": "string(hashed)",
    "group": "ID_group",
    "cin": "string",
    "justification_days_left": "Number(default=>10,]-&:+&[)",
    "profile": null,
    "is_deleted": "boolean",
    "role": "student | GS | FR"
  }*/
router.post("/modify", file_uploader.single("profile_pic"), async (req, res) => {
  const { student_id, token, updated_data } = req.body;
  if (!student_id || !token || Object.keys(updated_data).length == 0) return res.status(400).json({ message: "data is messing" });
  const [jwt_error, data] = await jwt_verify(token);
  if (jwt_error) return res.status(400).json({ message: "token error" });
  if (data.role !== roles.general_supervisor || data.id !== student_id) return res.status(401).json({ message: "you dont have access to this action" });
  if (req.file) {
    const filename = student_id + req.file.filename;
    fs.writeFile(path.join(__dirname, "profile_image", filename), req.file.buffer, {}, () => {});
    updated_data.profile = filename;
  }
  try {
    res.json(await User.findByIdAndUpdate(student_id, updated_data, { new: true }));
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "data base error" });
  }
});
module.exports = router;
