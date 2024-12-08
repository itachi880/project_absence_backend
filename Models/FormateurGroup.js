const { Schema, model } = require("mongoose");
const { FormateurGroupCollection } = require("./modelsName");

module.exports = model(
  FormateurGroupCollection,
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
/**
 * {
 *  formateur:"alami",
 *  id_group:"devfs206",
 *  sessions:[1,2]
 *  date:"2024-12-5",
 * }
 * Fomateurgroup.find({formateur:alami,id:group:devfs206,date:Date.now()})
 * Date.now()/108280038 /new Date() "2024-08-05"
 */
