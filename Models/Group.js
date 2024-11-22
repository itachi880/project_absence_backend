const { Schema, model } = require("mongoose");
const { GroupCollection } = require("./modelsName");

module.exports = model(
  GroupCollection,
  new Schema(
    {
      name: { type: String, required: true, unique: true },
      is_deleted: { type: Boolean, default: false },
      study_year: { type: Number, default: new Date().getFullYear },
    },
    { timestamps: true }
  )
);
