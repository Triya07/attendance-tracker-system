const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
console.log("Attendance routes loaded");
const {
  markAttendance,
  getMyAttendance,
  getAttendanceStats,
  getTeacherStudents,
  markAttendanceBulk,
  getTeacherRecords,
  getTeacherReport,
  updateAttendanceSession,
} = require("../controllers/attendanceController");

router.post("/mark", authMiddleware, markAttendance);
router.get("/my", authMiddleware, getMyAttendance);
router.get("/stats", authMiddleware, getAttendanceStats);
router.get("/teacher/students", authMiddleware, getTeacherStudents);
router.post("/teacher/mark-bulk", authMiddleware, markAttendanceBulk);
router.get("/teacher/records", authMiddleware, getTeacherRecords);
router.get("/teacher/report", authMiddleware, getTeacherReport);
router.put("/teacher/session", authMiddleware, updateAttendanceSession);

module.exports = router;