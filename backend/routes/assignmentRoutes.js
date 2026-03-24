const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  listAssignments,
  createAssignment,
  updateAssignment,
} = require("../controllers/assignmentController");

router.get("/", authMiddleware, listAssignments);
router.post("/", authMiddleware, createAssignment);
router.put("/:id", authMiddleware, updateAssignment);

module.exports = router;
