const Attendance = require("../models/Attendance");

const markAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.create({
      user: req.user._id,
      status: req.body.status || "present",
    });

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: "Failed to mark attendance" });
  }
};

const getMyAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ user: req.user._id });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch attendance" });
  }
};

const getAttendanceStats = async (req, res) => {
  try {
    const records = await Attendance.find({ user: req.user._id });

    const totalDays = records.length;

    const present = records.filter(
      (record) => record.status === "present",
    ).length;

    const absent = records.filter(
      (record) => record.status === "absent",
    ).length;

    const attendancePercentage =
      totalDays === 0 ? 0 : ((present / totalDays) * 100).toFixed(2);

    res.json({
      totalDays,
      present,
      absent,
      attendancePercentage,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to calculate attendance stats",
    });
  }
};

module.exports = {
  markAttendance,
  getMyAttendance,
  getAttendanceStats,
};