const { Schema, model } = require("mongoose");
const db = require("../DataBase");

module.exports = model(
  "User",
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
      role: { type: String, enum: ["student", "GS", "FR"], required: true },
    },
    { timestamps: true }
  )
);

// Exporting the models
// const User = model('User', userSchema);
// const Absence = model('Absence', absenceSchema);
// const Certification = model('Certification', certificationSchema);
// const Group = model('Group', groupSchema);
// const FormateurGroup = model('FormateurGroup', formateurGroupSchema);
