const Attendance = require("../models/Attendance");
const User = require("../models/User");

const ensureTeacher = (req, res) => {
  if (!req.user || req.user.role !== "teacher") {
    res.status(403).json({ message: "Teacher access only" });
    return false;
  }
  return true;
};

const normalizeDateOnly = (dateValue) => {
  const date = dateValue ? new Date(dateValue) : new Date();
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const markAttendance = async (req, res) => {
  try {
    const attendanceDate = normalizeDateOnly(req.body.date);

    if (!attendanceDate) {
      return res.status(400).json({ message: "Invalid attendance date" });
    }

    const attendance = await Attendance.create({
      user: req.user._id,
      student: req.user._id,
      status: req.body.status || "present",
      date: attendanceDate,
    });

    res.status(201).json(attendance);
  } catch {
    res.status(500).json({ message: "Failed to mark attendance" });
  }
};

const getMyAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ user: req.user._id });
    res.json(records);
  } catch {
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
  } catch {
    res.status(500).json({
      message: "Failed to calculate attendance stats",
    });
  }
};

const getTeacherStudents = async (req, res) => {
  try {
    if (!ensureTeacher(req, res)) {
      return;
    }

    const students = await User.find({ role: "student" })
      .select("name email")
      .sort({ name: 1 })
      .lean();

    const normalizedStudents = students.map((student, index) => ({
      _id: student._id,
      name: student.name,
      email: student.email,
      rollNo: `S${String(index + 1).padStart(3, "0")}`,
    }));

    res.json(normalizedStudents);
  } catch {
    res.status(500).json({ message: "Failed to fetch students" });
  }
};

const markAttendanceBulk = async (req, res) => {
  try {
    if (!ensureTeacher(req, res)) {
      return;
    }

    const {
      entries = [],
      subject = "General",
      course = "General",
      section = "A",
      semester = "1",
      date,
    } = req.body;

    if (!Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({ message: "Attendance entries are required" });
    }

    const normalizedDate = normalizeDateOnly(date);

    if (!normalizedDate) {
      return res.status(400).json({ message: "Invalid attendance date" });
    }

    const operations = entries.map((entry) => ({
      updateOne: {
        filter: {
          teacher: req.user._id,
          student: entry.studentId,
          date: normalizedDate,
          subject,
          section,
        },
        update: {
          $set: {
            teacher: req.user._id,
            student: entry.studentId,
            user: entry.studentId,
            status: entry.status,
            subject,
            course,
            section,
            semester,
            date: normalizedDate,
          },
        },
        upsert: true,
      },
    }));

    await Attendance.bulkWrite(operations);

    res.json({ message: "Attendance submitted successfully" });
  } catch {
    res.status(500).json({ message: "Failed to submit attendance" });
  }
};

const getTeacherRecords = async (req, res) => {
  try {
    if (!ensureTeacher(req, res)) {
      return;
    }

    const records = await Attendance.find({ teacher: req.user._id })
      .populate("student", "name email")
      .sort({ date: -1, createdAt: -1 })
      .lean();

    const grouped = new Map();

    records.forEach((record) => {
      const dateKey = new Date(record.date).toISOString().slice(0, 10);
      const key = `${dateKey}__${record.subject}__${record.section}`;

      if (!grouped.has(key)) {
        grouped.set(key, {
          sessionKey: key,
          date: dateKey,
          subject: record.subject,
          course: record.course,
          section: record.section,
          semester: record.semester,
          presentCount: 0,
          totalCount: 0,
          entries: [],
        });
      }

      const item = grouped.get(key);
      item.totalCount += 1;
      if (record.status === "present") {
        item.presentCount += 1;
      }

      item.entries.push({
        _id: record._id,
        studentId: record.student?._id || record.user,
        studentName: record.student?.name || "Unknown",
        studentEmail: record.student?.email || "",
        status: record.status,
      });
    });

    res.json(Array.from(grouped.values()));
  } catch {
    res.status(500).json({ message: "Failed to fetch teacher records" });
  }
};

const getTeacherReport = async (req, res) => {
  try {
    if (!ensureTeacher(req, res)) {
      return;
    }

    const records = await Attendance.find({ teacher: req.user._id })
      .populate("student", "name email")
      .lean();

    const byStudent = new Map();

    records.forEach((record) => {
      const studentId = String(record.student?._id || record.user);
      if (!byStudent.has(studentId)) {
        byStudent.set(studentId, {
          studentId,
          name: record.student?.name || "Unknown",
          email: record.student?.email || "",
          totalClasses: 0,
          present: 0,
          absent: 0,
        });
      }

      const current = byStudent.get(studentId);
      current.totalClasses += 1;
      if (record.status === "present") {
        current.present += 1;
      } else {
        current.absent += 1;
      }
    });

    const reportRows = Array.from(byStudent.values()).map((item) => ({
      ...item,
      attendancePercentage:
        item.totalClasses === 0 ? 0 : Number(((item.present / item.totalClasses) * 100).toFixed(2)),
    }));

    res.json(reportRows.sort((a, b) => b.attendancePercentage - a.attendancePercentage));
  } catch {
    res.status(500).json({ message: "Failed to fetch teacher report" });
  }
};

const updateAttendanceSession = async (req, res) => {
  try {
    if (!ensureTeacher(req, res)) {
      return;
    }

    const { date, subject, section, entries = [] } = req.body;

    if (!date || !subject || !section || !Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({ message: "date, subject, section and entries are required" });
    }

    const normalizedDate = normalizeDateOnly(date);
    if (!normalizedDate) {
      return res.status(400).json({ message: "Invalid attendance date" });
    }

    const operations = entries.map((entry) => ({
      updateOne: {
        filter: {
          teacher: req.user._id,
          student: entry.studentId,
          date: normalizedDate,
          subject,
          section,
        },
        update: {
          $set: {
            status: entry.status,
          },
        },
      },
    }));

    await Attendance.bulkWrite(operations);

    res.json({ message: "Attendance session updated successfully" });
  } catch {
    res.status(500).json({ message: "Failed to update attendance session" });
  }
};

module.exports = {
  markAttendance,
  getMyAttendance,
  getAttendanceStats,
  getTeacherStudents,
  markAttendanceBulk,
  getTeacherRecords,
  getTeacherReport,
  updateAttendanceSession,
};