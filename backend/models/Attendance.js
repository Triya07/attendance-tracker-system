const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: String,
      trim: true,
      default: "General",
    },
    course: {
      type: String,
      trim: true,
      default: "General",
    },
    section: {
      type: String,
      trim: true,
      default: "A",
    },
    semester: {
      type: String,
      trim: true,
      default: "1",
    },
    status: {
      type: String,
      enum: ["present", "absent"],
      default: "present",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

attendanceSchema.index(
  { teacher: 1, student: 1, date: 1, subject: 1, section: 1 },
  { unique: true, partialFilterExpression: { teacher: { $exists: true } } },
);

module.exports = mongoose.model("Attendance", attendanceSchema);