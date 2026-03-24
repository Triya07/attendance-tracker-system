const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    subject: {
      type: String,
      trim: true,
      default: "General",
    },
    dueDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Assignment", assignmentSchema);
