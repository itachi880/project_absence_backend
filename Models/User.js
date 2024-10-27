const { Schema, model } = require("mongoose");
const { UserCollection } = require("./modelsName");

module.exports = model(
  UserCollection,
  new Schema(
    {
      first_name: { type: String, required: true },
      last_name: { type: String, required: true },
      login: { type: String, required: true, unique: true },
      password: { type: String, required: true }, //hashed version
      group: { type: Schema.Types.ObjectId, ref: "Group", default: null },
      cin: { type: String, required: true },
      justification_days_left: { type: Number, default: 10 },
      absences: [{ type: Schema.Types.ObjectId, ref: "Absence" }],
      is_deleted: { type: Boolean, default: false },
      role: { type: String, enum: ["student", "GS", "FR"], required: true, default: "student" },
    },
    { timestamps: true }
  ).set("toJSON", {
    transform: (doc, ret) => {
      delete ret.password; // Remove passowrd whene use res.json(user)
      return ret;
    },
  })
);
