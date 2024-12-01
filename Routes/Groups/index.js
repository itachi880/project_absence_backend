const FormateurGroup = require("../../Models/FormateurGroup");
const Group = require("../../Models/Group");
const User = require("../../Models/User");
const { jwt_verify } = require("../../utils/jwt_auth");
const roles = require("../../utils/roles");
const { Types, default: mongoose } = require("mongoose");
const router = require("express").Router();
const PageLimitForDocs = 2;
router.post("/add", async (req, res) => {
  const { name = undefined, study_year = undefined, token = undefined } = req.body;
  if (!name) return res.status(400).end("data is messing");
  if (!token) return res.status(401).end("token error");
  const [jwt_error, data] = await jwt_verify(token);
  if (jwt_error) return res.status(401).end("token wrong");
  if (data.role != roles.general_supervisor) return res.status(401).end("you dont have access to this action");
  try {
    return res.json(await new Group({ name: name?.toUpperCase(), study_year: +study_year }).save());
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
  const { token = false, archived = "false", pageNumber = 0 } = req.query;
  if (!token) return res.status(400).end("incoreccte les donnes que vous avez envoyer");
  const [auth_error, auth_data] = await jwt_verify(token);
  if (auth_error) return res.status(401).end("token pas valide");
  if (auth_data.role == roles.student) return res.status(401).end("you dont have access only admins and general supervisor are welcome to perform this actions");
  try {
    if (auth_data.role == roles.Formateur)
      return res.json({
        groups: await FormateurGroup.aggregate([
          {
            $match: {
              formateur: new mongoose.Types.ObjectId(auth_data.id),
              date: new Date().toISOString().split("T")[0] + "T00:00:00",
            },
          },
          {
            $lookup: {
              from: "groups", // Collection name for Group (lowercase + pluralized)
              localField: "id_group",
              foreignField: "_id",
              as: "groupDetails",
            },
          },
          {
            $unwind: "$groupDetails", // Flatten groupDetails array
          },
          {
            $match: { "groupDetails.is_deleted": false }, // Exclude deleted groups
          },
          {
            $project: {
              _id: 0, // Exclude FormateurGroup _id
              group: "$groupDetails.name",
              study_year: "$groupDetails.study_year",
              sessions: 1,
              date: 1,
            },
          },
        ]),
      });

    res.json({
      groups: await Group.find({ is_deleted: archived[0] == "f" ? false : true })
        .skip(pageNumber * PageLimitForDocs)
        .limit(PageLimitForDocs),
      current: pageNumber,
    });
  } catch (e) {
    res.status(500).end("db error");
    console.log(e);
  }
});
router.get("/getByID", async (req, res) => {
  const { token = false, id = false } = req.query;
  if (!token || !id) return res.status(400).end("data incompleate");
  const [error_auth, data_auth] = await jwt_verify(token);
  if (error_auth) return res.status(401).end("you dont have access");
  try {
    if (data_auth.role != roles.general_supervisor && data_auth.role != roles.Formateur) {
      const results = await Group.aggregate([
        {
          $lookup: {
            from: "users", // Assuming users collection
            localField: "_id", // Group ID
            foreignField: "group", // Assuming users have a `group` field linking to group
            as: "users", // Join users into the 'users' field
          },
        },
        {
          $match: {
            _id: new Types.ObjectId(id), // Match the group by ID

            "users._id": new Types.ObjectId(data_auth.id), // Match userId with logged-in user
          },
        },
        {
          $project: {
            users: 0, // Exclude the 'users' field from the final result
          },
        },
      ]);
      if (results.length == 0) return res.status(401).end("this isn't your group :)");
      return res.json(results[0]);
    }
    return res.json(await Group.findById(id));
  } catch (e) {
    console.log(e);
    return res.status(500).end("error in back end");
  }
});
router.get("/searchGroups", async (req, res) => {
  const { query = false } = req.query;
  if (!query) return res.status(400).end("data incompleate");

  try {
    const results = await Group.find({
      name: { $regex: query, $options: "i" },
      is_deleted: false,
    });

    if (results.length == 0) {
      return res.status(404).send("No groups found.");
    }

    return res.status(200).json(results);
  } catch (err) {
    res.status(500).end("error");
    return console.error("Error fetching groups:", err);
  }
});
router.put("/undo/delete", async (req, res) => {
  const { token = false, group_id = false } = req.body;
  if (!token || !group_id) return res.status(400).end("data incompleated");
  const [auth_error, auth_data] = await jwt_verify(token);
  if (auth_error) return res.status(401).end("token error");
  if (auth_data.role != roles.general_supervisor) return res.status(401).end("dont have access");
  try {
    res.json(await Group.updateOne({ _id: group_id }, { is_deleted: false }));
    await User.updateMany({ group: group_id }, { is_deleted: false });
  } catch (e) {
    return res.status(500).end("server error");
  }
});

module.exports = router;
