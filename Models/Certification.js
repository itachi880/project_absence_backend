const { Schema, model } = require("mongoose");
const { CertificationCollection } = require("./modelsName");

module.exports = model(
  CertificationCollection,
  new Schema(
    {
      student_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
      justification_date: { type: Number, required: true }, // number of days in certeficate
      start_date: { type: Date, required: true },
      details: { type: String, default: "" },
      media: { type: String, required: true },
      created_at: { type: Date, default: Date.now },
      status: { type: String, enum: ["pending", "validated", "not validated"], required: true },
    },
    { timestamps: true }
  )
);
