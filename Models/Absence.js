const { Schema, model } = require("mongoose");

module.exports = model(
  "Absence",
  new Schema(
    {
      student_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
      group: { type: Schema.Types.ObjectId, ref: "Group", required: true },
      month: { type: String, required: true }, // Format: YYYY-MM
      absences_justifiees: { type: Number, default: 0 },
      total_absences: { type: Number, default: 0 },
      absences: [
        {
          date: { type: Number, min: 1, max: 31, required: true },
          sessions: [{ type: Number, required: true }],
          justification_id: { type: Schema.Types.ObjectId, ref: "Certification", default: null },
        },
      ],
    },
    { timestamps: true }
  )
);
