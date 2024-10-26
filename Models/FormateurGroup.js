const { Schema, model } = require("mongoose");

module.exports = model(
  "FormateurGroup",
  new Schema(
    {
      formateur: { type: Schema.Types.ObjectId, ref: "User", required: true },
      id_group: { type: Schema.Types.ObjectId, ref: "Group", required: true },
      sessions: [{ type: Number, required: true }],
      date: { type: Date, required: true },
    },
    { timestamps: true }
  )
);
