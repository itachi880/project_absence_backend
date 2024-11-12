const { Schema, model } = require("mongoose");
const { DonnesGroupsCollection } = require("./modelsName");
module.exports = model(
  DonnesGroupsCollection,
  new Schema(
    {
      group_id: { type: Schema.Types.ObjectId, required: true },
      note_groupe: { type: Number, default: 20 },
      abscence_moyen: { type: Number, default: 0 },
      is_latest: { type: Boolean, default: false },
      date: { type: Date, default: Date.now },
    },
    { timestamps: true }
  )
);
