const User = require("../../Models/User");
const { jwt_verify } = require("../../utils/jwt_auth");
const roles = require("../../utils/roles");
const router = require("express").Router();

// all requests start from '/login' exp for / its /login/
// inscription from idara o l7irassa
router.post("/", async (req, res) => {
  const { jwt_token, first_name, last_name, cin, login, password } = req.body;
  //these for verification and messing data from the from end
  const [auth_error, auth_data] = await jwt_verify(jwt_token);
  if (auth_error) return res.status(401).end("jwt error");
  if (auth_data.role != roles.general_supervisor) return res.status(401).send("you dont have access only admins and general supervisor are welcome to perform this actions");
  if (!first_name || !last_name || !cin || !login || !password) return res.status(400).json({ msg: "data incompleate", data: { first_name, last_name, cin, login, password } });
  //if all data is good :)
  try {
    res.json(await new User({ first_name, last_name, cin, login, password }).save());
  } catch (e) {
    res.status(500).json(e);
  }
});
//login
router.post("/", (req, res) => {});
module.exports = router;
