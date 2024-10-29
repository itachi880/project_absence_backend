const User = require("../../Models/User");
const { jwt_verify, HashPass } = require("../../utils/jwt_auth");
const roles = require("../../utils/roles");
const router = require("express").Router();
// inscription from idara o l7irassa
router.post("/add", async (req, res) => {
  const { jwt_token = false, first_name = false, last_name = false, cin = false, login = false, password = false, group_ID = false } = req.body;

  const [auth_error, auth_data] = await jwt_verify(jwt_token);

  if (auth_error) return res.status(401).json({ message: "token pas valide" });
  if (auth_data.role != roles.general_supervisor) return res.status(401).json({ message: "you dont have access only admins and general supervisor are welcome to perform this actions" });
  if (!first_name || !last_name || !cin || !login || !password) return res.status(400).json({ message: "data incompleate", data: { first_name, last_name, cin, login, password } });

  try {
    res.json((await new User({ first_name, last_name, cin, login, password: HashPass(password), group: group_ID, profile: null }).save()).toJSON());
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "check errors in logs" });
  }
});

module.exports = router;
