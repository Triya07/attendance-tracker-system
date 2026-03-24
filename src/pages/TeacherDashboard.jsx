import { useEffect, useMemo, useState } from "react";
import { assignmentAPI, attendanceAPI } from "../utils/apiClient";
import "../styles/teacher-dashboard.css";

const classTemplates = [
  { id: 1, subject: "Data Structures", course: "B.Tech CSE", semester: "3", section: "A" },
  { id: 2, subject: "DBMS", course: "B.Tech CSE", semester: "4", section: "A" },
  { id: 3, subject: "Web Development", course: "B.Tech CSE", semester: "4", section: "B" },
];

function TeacherDashboard() {
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState([]);
  const [reportRows, setReportRows] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedClass, setSelectedClass] = useState(classTemplates[0]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [activeTab, setActiveTab] = useState("mark");
  const [editingRecord, setEditingRecord] = useState(null);
  const [editingStatus, setEditingStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [assignmentForm, setAssignmentForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    subject: classTemplates[0].subject,
  });

  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser") || "{}");
    } catch {
      return {};
    }
  }, []);

  const teacherData = useMemo(
    () => ({
      name: currentUser.name || "Teacher",
      teacherId: currentUser.id || "-",
      department: "Academic Department",
      subjectsAssigned: classTemplates.map((item) => item.subject),
      profilePhoto: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        currentUser.name || "Teacher",
      )}&size=150&background=f59e0b&color=fff`,
    }),
    [currentUser],
  );

  const loadTeacherData = async () => {
    setLoading(true);
    setError("");

    try {
      const [studentsResponse, recordsResponse, reportResponse, assignmentResponse] =
        await Promise.all([
          attendanceAPI.getTeacherStudents(),
          attendanceAPI.getTeacherRecords(),
          attendanceAPI.getTeacherReport(),
          assignmentAPI.list(),
        ]);

      setStudents(studentsResponse);
      setRecords(recordsResponse);
      setReportRows(reportResponse);
      setAssignments(assignmentResponse);
    } catch (fetchError) {
      setError(fetchError.message || "Failed to load teacher dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeacherData();
  }, []);

  useEffect(() => {
    if (!message) {
      return;
    }
    const timer = setTimeout(() => setMessage(""), 2500);
    return () => clearTimeout(timer);
  }, [message]);

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceStatus({
      ...attendanceStatus,
      [studentId]: status,
    });
  };

  const markAllPresent = () => {
    const newStatus = {};
    students.forEach((student) => {
      newStatus[student._id] = "present";
    });
    setAttendanceStatus(newStatus);
  };

  const markAllAbsent = () => {
    const newStatus = {};
    students.forEach((student) => {
      newStatus[student._id] = "absent";
    });
    setAttendanceStatus(newStatus);
  };

  const handleSubmitAttendance = async () => {
    if (Object.keys(attendanceStatus).length === 0) {
      setError("Please mark attendance for at least one student");
      return;
    }

    setError("");
    try {
      await attendanceAPI.markAttendanceBulk({
        subject: selectedClass.subject,
        course: selectedClass.course,
        section: selectedClass.section,
        semester: selectedClass.semester,
        date: selectedDate,
        entries: students.map((student) => ({
          studentId: student._id,
          status: attendanceStatus[student._id] || "absent",
        })),
      });

      setMessage(`Attendance submitted for ${selectedClass.subject} on ${selectedDate}`);
      await loadTeacherData();
    } catch (submitError) {
      setError(submitError.message || "Failed to submit attendance");
    }

    setAttendanceStatus({});
  };

  const getPercentageColor = (percentage) => {
    if (percentage >= 90) return "#10b981";
    if (percentage >= 75) return "#f59e0b";
    return "#ef4444";
  };

  const handleEditRecord = (record) => {
    setEditingRecord(record);
    const nextStatus = {};
    record.entries.forEach((entry) => {
      nextStatus[entry.studentId] = entry.status;
    });
    setEditingStatus(nextStatus);
    setActiveTab("edit");
  };

  const handleUpdateRecord = async () => {
    if (!editingRecord) {
      return;
    }

    try {
      await attendanceAPI.updateTeacherSession({
        date: editingRecord.date,
        subject: editingRecord.subject,
        section: editingRecord.section,
        entries: editingRecord.entries.map((entry) => ({
          studentId: entry.studentId,
          status: editingStatus[entry.studentId] || entry.status,
        })),
      });

      setMessage("Attendance record updated successfully");
      await loadTeacherData();
    } catch (updateError) {
      setError(updateError.message || "Failed to update record");
      return;
    }

    setEditingRecord(null);
    setActiveTab("records");
  };

  const handleCreateAssignment = async () => {
    if (!assignmentForm.title || !assignmentForm.dueDate) {
      setError("Assignment title and due date are required");
      return;
    }

    try {
      await assignmentAPI.create(assignmentForm);
      setAssignmentForm({
        title: "",
        description: "",
        dueDate: "",
        subject: selectedClass.subject,
      });
      setMessage("Assignment created successfully");
      await loadTeacherData();
    } catch (assignmentError) {
      setError(assignmentError.message || "Failed to create assignment");
    }
  };

  if (loading) {
    return (
      <div className="teacher-dashboard">
        <div className="glass-panel attendance-section">
          <h3>Loading teacher dashboard...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Teacher Dashboard</h1>
        <p>Manage classes and mark attendance efficiently</p>
      </div>

      {error && <div className="glass-panel" style={{ color: "#ef4444" }}>{error}</div>}
      {message && <div className="glass-panel" style={{ color: "#10b981" }}>{message}</div>}

      {/* Teacher Profile Section */}
      <div className="glass-panel profile-section">
        <div className="profile-container">
          <div className="profile-image-wrapper">
            <img src={teacherData.profilePhoto} alt="Teacher" className="profile-image" />
            <div className="profile-badge">Online</div>
          </div>
          <div className="profile-info">
            <h2 className="profile-name">{teacherData.name}</h2>
            <div className="profile-details">
              <div className="detail-item">
                <span className="detail-label">Teacher ID</span>
                <span className="detail-value">{teacherData.teacherId}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Department</span>
                <span className="detail-value">{teacherData.department}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Subjects Assigned</span>
                <div className="subjects-list-profile">
                  {teacherData.subjectsAssigned.map((subject, idx) => (
                    <span key={idx} className="subject-badge">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="nav-tabs">
        <button
          className={`nav-tab ${activeTab === "mark" ? "active" : ""}`}
          onClick={() => setActiveTab("mark")}
        >
          <span className="tab-icon">📝</span> Mark Attendance
        </button>
        <button
          className={`nav-tab ${activeTab === "records" ? "active" : ""}`}
          onClick={() => setActiveTab("records")}
        >
          <span className="tab-icon">📋</span> View Records
        </button>
        <button
          className={`nav-tab ${activeTab === "report" ? "active" : ""}`}
          onClick={() => setActiveTab("report")}
        >
          <span className="tab-icon">📊</span> Reports
        </button>
        <button
          className={`nav-tab ${activeTab === "edit" ? "active" : ""}`}
          onClick={() => setActiveTab("edit")}
        >
          <span className="tab-icon">✏️</span> Edit Attendance
        </button>
        <button
          className={`nav-tab ${activeTab === "assignment" ? "active" : ""}`}
          onClick={() => setActiveTab("assignment")}
        >
          <span className="tab-icon">📚</span> Assignments
        </button>
      </div>

      {/* MARK ATTENDANCE TAB */}
      {activeTab === "mark" && (
        <div className="tab-content">
          {/* Class Selection */}
          <div className="glass-panel class-selection-section">
            <div className="section-header">
              <h3>Class / Course Selection</h3>
              <p className="section-subtitle">Select the class you want to manage</p>
            </div>

            <div className="selection-grid">
              <div className="selection-form-group">
                <label className="form-label">Subject</label>
                <select
                  className="form-select"
                  value={selectedClass.id}
                  onChange={(e) =>
                    setSelectedClass(
                      classTemplates.find((c) => c.id === parseInt(e.target.value, 10)),
                    )
                  }
                >
                  {classTemplates.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.subject} - {cls.course} ({cls.section})
                    </option>
                  ))}
                </select>
              </div>

              <div className="selection-form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-select"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>

            <div className="class-info">
              <div className="info-item">
                <span className="info-label">Subject:</span>
                <span className="info-value">{selectedClass.subject}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Course:</span>
                <span className="info-value">{selectedClass.course}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Section:</span>
                <span className="info-value">{selectedClass.section}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Semester:</span>
                <span className="info-value">{selectedClass.semester}</span>
              </div>
            </div>
          </div>

          {/* Mark Attendance */}
          <div className="glass-panel attendance-section">
            <div className="section-header">
              <h3>Mark Attendance</h3>
              <p className="section-subtitle">Select present or absent for each student</p>
            </div>

            <div className="action-buttons">
              <button className="action-btn green" onClick={markAllPresent}>
                ✓ Mark All Present
              </button>
              <button className="action-btn red" onClick={markAllAbsent}>
                ✕ Mark All Absent
              </button>
              <button className="action-btn reset" onClick={() => setAttendanceStatus({})}>
                🔄 Clear Selection
              </button>
            </div>

            <div className="student-list">
              {students.map((student, idx) => (
                <div key={student._id} className="student-item" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <div className="student-info">
                    <div className="student-name">{student.name}</div>
                    <div className="student-rollno">Roll No: {student.rollNo}</div>
                  </div>

                  <div className="attendance-buttons">
                    <button
                      className={`attendance-btn present ${
                        attendanceStatus[student._id] === "present" ? "selected" : ""
                      }`}
                      onClick={() => handleAttendanceChange(student._id, "present")}
                    >
                      ✓ Present
                    </button>
                    <button
                      className={`attendance-btn absent ${
                        attendanceStatus[student._id] === "absent" ? "selected" : ""
                      }`}
                      onClick={() => handleAttendanceChange(student._id, "absent")}
                    >
                      ✕ Absent
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="submit-section">
              <div className="submission-stats">
                <span className="stat-item">
                  Total Students: <strong>{students.length}</strong>
                </span>
                <span className="stat-item">
                  Marked: <strong>{Object.keys(attendanceStatus).length}</strong>
                </span>
                <span className="stat-item percentage">
                  Progress: <strong>{students.length ? Math.round((Object.keys(attendanceStatus).length / students.length) * 100) : 0}%</strong>
                </span>
              </div>
              <button className="submit-btn" onClick={handleSubmitAttendance}>
                ✓ Submit Attendance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW RECORDS TAB */}
      {activeTab === "records" && (
        <div className="tab-content">
          <div className="glass-panel records-section">
            <div className="section-header">
              <h3>Attendance Records</h3>
              <p className="section-subtitle">View previously marked attendance</p>
            </div>

            <div className="records-table-wrapper">
              <table className="records-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Subject</th>
                    <th>Section</th>
                    <th>Present / Total</th>
                    <th>Percentage</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, idx) => (
                    <tr key={record.sessionKey} style={{ animationDelay: `${idx * 0.05}s` }}>
                      <td>{new Date(record.date).toLocaleDateString()}</td>
                      <td>{record.subject}</td>
                      <td>{record.section}</td>
                      <td>
                        <span className="count-badge">
                          {record.presentCount}/{record.totalCount}
                        </span>
                      </td>
                      <td>
                        <span
                          className="percentage-badge"
                          style={{
                            backgroundColor:
                              getPercentageColor((record.presentCount / record.totalCount) * 100) +
                              "20",
                            color: getPercentageColor(
                              (record.presentCount / record.totalCount) * 100
                            ),
                          }}
                        >
                          {Math.round((record.presentCount / record.totalCount) * 100)}%
                        </span>
                      </td>
                      <td>
                        <button
                          className="action-icon-btn view"
                          title="View Details"
                          onClick={() => {
                            const details = record.entries
                              .map((entry) => `${entry.studentName}: ${entry.status}`)
                              .join("\n");
                            window.alert(details || "No records found");
                          }}
                        >
                          👁️
                        </button>
                        <button
                          className="action-icon-btn edit"
                          title="Edit"
                          onClick={() => handleEditRecord(record)}
                        >
                          ✏️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* REPORT TAB */}
      {activeTab === "report" && (
        <div className="tab-content">
          <div className="glass-panel report-section">
            <div className="section-header">
              <h3>Attendance Report</h3>
              <p className="section-subtitle">Student attendance statistics</p>
            </div>

            <div className="report-filters">
              <div className="filter-group">
                <label>Filter by Subject</label>
                <select className="form-select">
                  <option>All Subjects</option>
                  <option>Data Structures</option>
                  <option>DBMS</option>
                  <option>Web Development</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Sort By</label>
                <select className="form-select">
                  <option>Attendance %</option>
                  <option>Name</option>
                  <option>Roll No</option>
                </select>
              </div>
            </div>

            <div className="report-table-wrapper">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Roll No</th>
                    <th>Total Classes</th>
                    <th>Present</th>
                    <th>Absent</th>
                    <th>Attendance %</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reportRows.map((student, idx) => {
                    const percentage = Number(student.attendancePercentage || 0);
                    const absent = student.absent;
                    return (
                      <tr key={student.studentId} style={{ animationDelay: `${idx * 0.05}s` }}>
                        <td className="student-name-report">{student.name}</td>
                        <td>{student.email || "-"}</td>
                        <td>{student.totalClasses}</td>
                        <td className="present-count">{student.present}</td>
                        <td className="absent-count">{absent}</td>
                        <td>
                          <span
                            className="percentage-badge-report"
                            style={{
                              backgroundColor: getPercentageColor(percentage) + "20",
                              color: getPercentageColor(percentage),
                            }}
                          >
                            {percentage}%
                          </span>
                        </td>
                        <td>
                          <span
                            className={`status-badge ${percentage >= 75 ? "good" : "warning"}`}
                          >
                            {percentage >= 75 ? "✓ Good" : "⚠️ Low"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="report-summary">
              <div className="summary-card">
                <h4>Highest Attendance</h4>
                <p className="summary-value">
                  {reportRows.length ? `${Math.max(...reportRows.map((r) => r.attendancePercentage)).toFixed(0)}%` : "0%"}
                </p>
                <p className="summary-students">Top performer</p>
              </div>
              <div className="summary-card">
                <h4>Average Attendance</h4>
                <p className="summary-value">
                  {reportRows.length
                    ? `${(
                        reportRows.reduce((sum, row) => sum + row.attendancePercentage, 0) /
                        reportRows.length
                      ).toFixed(0)}%`
                    : "0%"}
                </p>
                <p className="summary-students">Across all students</p>
              </div>
              <div className="summary-card">
                <h4>Low Attendance</h4>
                <p className="summary-value">{reportRows.filter((row) => row.attendancePercentage < 75).length}</p>
                <p className="summary-students">Students below 75%</p>
              </div>
              <div className="summary-card">
                <h4>Total Classes</h4>
                <p className="summary-value">{records.length}</p>
                <p className="summary-students">Attendance sessions</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT ATTENDANCE TAB */}
      {activeTab === "edit" && (
        <div className="tab-content">
          <div className="glass-panel edit-section">
            <div className="section-header">
              <h3>Edit Attendance Record</h3>
              <p className="section-subtitle">Correct attendance mistakes or update records</p>
            </div>

            {editingRecord ? (
              <>
                <div className="edit-form">
                  <div className="edit-info">
                    <div className="edit-info-item">
                      <span className="edit-label">Date:</span>
                      <span className="edit-value">{editingRecord.date}</span>
                    </div>
                    <div className="edit-info-item">
                      <span className="edit-label">Subject:</span>
                      <span className="edit-value">{editingRecord.subject}</span>
                    </div>
                    <div className="edit-info-item">
                      <span className="edit-label">Section:</span>
                      <span className="edit-value">{editingRecord.section}</span>
                    </div>
                  </div>

                  <div className="edit-student-list">
                    <h4>Update Student Attendance</h4>
                    {editingRecord.entries.map((entry, idx) => (
                      <div key={entry.studentId} className="edit-student-item" style={{ animationDelay: `${idx * 0.05}s` }}>
                        <div className="edit-student-info">
                          <span className="edit-student-name">{entry.studentName}</span>
                          <span className="edit-student-roll">{entry.studentEmail || "-"}</span>
                        </div>
                        <div className="edit-attendance-buttons">
                          <button
                            className={`edit-btn present ${editingStatus[entry.studentId] === "present" ? "selected" : ""}`}
                            onClick={() =>
                              setEditingStatus((prev) => ({
                                ...prev,
                                [entry.studentId]: "present",
                              }))
                            }
                          >
                            ✓ Present
                          </button>
                          <button
                            className={`edit-btn absent ${editingStatus[entry.studentId] === "absent" ? "selected" : ""}`}
                            onClick={() =>
                              setEditingStatus((prev) => ({
                                ...prev,
                                [entry.studentId]: "absent",
                              }))
                            }
                          >
                            ✕ Absent
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="edit-actions">
                    <button className="edit-submit-btn" onClick={handleUpdateRecord}>
                      ✓ Update Record
                    </button>
                    <button className="edit-cancel-btn" onClick={() => setEditingRecord(null)}>
                      ✕ Cancel
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="no-selection">
                <p className="empty-state-icon">📋</p>
                <p className="empty-state-text">Select a record from the View Records tab to edit</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "assignment" && (
        <div className="tab-content">
          <div className="glass-panel report-section">
            <div className="section-header">
              <h3>Manage Assignments</h3>
              <p className="section-subtitle">Create assignments and track upcoming deadlines</p>
            </div>

            <div className="selection-grid">
              <div className="selection-form-group">
                <label className="form-label">Title</label>
                <input
                  className="form-select"
                  value={assignmentForm.title}
                  onChange={(e) =>
                    setAssignmentForm((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="selection-form-group">
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  className="form-select"
                  value={assignmentForm.dueDate}
                  onChange={(e) =>
                    setAssignmentForm((prev) => ({
                      ...prev,
                      dueDate: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="selection-form-group">
                <label className="form-label">Subject</label>
                <select
                  className="form-select"
                  value={assignmentForm.subject}
                  onChange={(e) =>
                    setAssignmentForm((prev) => ({
                      ...prev,
                      subject: e.target.value,
                    }))
                  }
                >
                  {classTemplates.map((cls) => (
                    <option key={cls.id} value={cls.subject}>
                      {cls.subject}
                    </option>
                  ))}
                </select>
              </div>

              <div className="selection-form-group">
                <label className="form-label">Description</label>
                <input
                  className="form-select"
                  value={assignmentForm.description}
                  onChange={(e) =>
                    setAssignmentForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="action-buttons">
              <button className="action-btn green" onClick={handleCreateAssignment}>
                + Create Assignment
              </button>
            </div>

            <div className="records-table-wrapper">
              <table className="records-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Subject</th>
                    <th>Due Date</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((item) => (
                    <tr key={item._id}>
                      <td>{item.title}</td>
                      <td>{item.subject}</td>
                      <td>{new Date(item.dueDate).toLocaleDateString()}</td>
                      <td>{item.description || "-"}</td>
                    </tr>
                  ))}
                  {assignments.length === 0 && (
                    <tr>
                      <td colSpan="4">No assignments created yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherDashboard;
