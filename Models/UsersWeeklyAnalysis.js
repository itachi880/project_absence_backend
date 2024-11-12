const { Schema, model } = require("mongoose");
const { DonnesUsersCollection } = require("./modelsName");
module.exports = model(
  DonnesUsersCollection,
  new Schema(
    {
      user_id: { type: Schema.Types.ObjectId, required: true },
      total_absence: { type: Number, default: 0 },
      total_absence_justify: { type: Number, default: 0 },
      is_latest: { type: Boolean, default: false },
      date: { type: Date, default: Date.now },
    },
    { timestamps: true }
  )
);
