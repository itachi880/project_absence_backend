const path = require("path");
const User = require("../../Models/User");
const file_uploader = require("../../utils/file_uploader");
const { HashPass } = require("../../utils/hashPass");
const { jwt_verify } = require("../../utils/jwt_auth");
const roles = require("../../utils/roles");
const fs = require("fs");
const { image_profiles_folder } = require("../../utils/foldersName");
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
});
router.post("/modify", file_uploader.single("profile_pic"), async (req, res) => {
  let { student_id, token, updated_data } = req.body;
  if (!student_id || !token) return res.status(400).json({ message: "data is messing" });
  try {
    updated_data = JSON.parse(updated_data);
  } catch (parseError) {
    console.error("JSON parse error:", parseError);
    return res.status(400).json({ message: "Invalid JSON format in updated_data" });
  }
  const [jwt_error, data] = await jwt_verify(token);
  if (jwt_error) return res.status(400).json({ message: "token error" });
  if (data.role !== roles.general_supervisor && data.id !== student_id) return res.status(401).json({ message: "you dont have access to this action" });
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
    return res.status(500).json({ message: "data base error" });
  }
});

router.post("/delete", async (req, res) => {
  const { token = false,student_id=false } = req.body;
  if(!token || !student_id) return res.status(400).json({message:'incoreccte les donnes que vous avez envoyer'})
  
  const [auth_error, auth_data] = await jwt_verify(token);

  if (auth_error) return res.status(401).json({ message: "token pas valide" });
  if (auth_data.role != roles.general_supervisor) return res.status(401).json({ message: "you dont have access only admins and general supervisor are welcome to perform this actions" });
  
  try{
    await User.updateOne({_id:student_id},{$set:{is_deleted:true}});
    return res.json({message:"etudiant suprimer avec sucses"})
  }catch(e){
    console.log(e);
    return res.status(500).json({message:"db error"})
  }
  
});
module.exports = router;
