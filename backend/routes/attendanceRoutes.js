const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
console.log("Attendance routes loaded");
const {
  markAttendance,
  getMyAttendance,
  getAttendanceStats,
} = require("../controllers/attendanceController");

router.post("/mark", authMiddleware, markAttendance);
router.get("/my", authMiddleware, getMyAttendance);
router.get("/stats", authMiddleware, getAttendanceStats);

module.exports = router;