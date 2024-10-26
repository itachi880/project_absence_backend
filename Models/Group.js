const { Schema, model } = require("mongoose");

module.exports = model(
  "Group",
  new Schema(
    {
      name: { type: String, required: true },
      is_deleted: { type: Boolean, default: false },
    },
    { timestamps: true }
  )
);
