const { Schema, model } = require("mongoose");
const { GroupCollection } = require("./modelsName");

module.exports = model(
  GroupCollection,
  new Schema(
    {
      name: { type: String, required: true },
      is_deleted: { type: Boolean, default: false },
    },
    { timestamps: true }
  )
);
