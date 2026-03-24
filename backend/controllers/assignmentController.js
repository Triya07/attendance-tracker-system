const Assignment = require("../models/Assignment");

const ensureTeacher = (req, res) => {
  if (!req.user || req.user.role !== "teacher") {
    res.status(403).json({ message: "Teacher access only" });
    return false;
  }
  return true;
};

const listAssignments = async (req, res) => {
  try {
    if (!ensureTeacher(req, res)) {
      return;
    }

    const items = await Assignment.find({ teacher: req.user._id })
      .sort({ dueDate: 1, createdAt: -1 })
      .lean();

    res.json(items);
  } catch {
    res.status(500).json({ message: "Failed to fetch assignments" });
  }
};

const createAssignment = async (req, res) => {
  try {
    if (!ensureTeacher(req, res)) {
      return;
    }

    const { title, description = "", subject = "General", dueDate } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({ message: "Title and due date are required" });
    }

    const assignment = await Assignment.create({
      teacher: req.user._id,
      title: title.trim(),
      description: description.trim(),
      subject: subject.trim() || "General",
      dueDate: new Date(dueDate),
    });

    res.status(201).json(assignment);
  } catch {
    res.status(500).json({ message: "Failed to create assignment" });
  }
};

const updateAssignment = async (req, res) => {
  try {
    if (!ensureTeacher(req, res)) {
      return;
    }

    const { id } = req.params;

    const updated = await Assignment.findOneAndUpdate(
      { _id: id, teacher: req.user._id },
      {
        $set: {
          ...(req.body.title ? { title: String(req.body.title).trim() } : {}),
          ...(req.body.description !== undefined
            ? { description: String(req.body.description).trim() }
            : {}),
          ...(req.body.subject ? { subject: String(req.body.subject).trim() } : {}),
          ...(req.body.dueDate ? { dueDate: new Date(req.body.dueDate) } : {}),
        },
      },
      { new: true },
    );

    if (!updated) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.json(updated);
  } catch {
    res.status(500).json({ message: "Failed to update assignment" });
  }
};

module.exports = {
  listAssignments,
  createAssignment,
  updateAssignment,
};
