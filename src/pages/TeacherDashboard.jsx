import { useState, useEffect } from "react";
import "../styles/teacher-dashboard.css";

function TeacherDashboard() {
  const [teacherData] = useState({
    name: "Dr. Priya Sharma",
    teacherId: "TCH20240301",
    department: "Computer Science",
    subjectsAssigned: ["Data Structures", "DBMS", "Web Development"],
    profilePhoto: "https://ui-avatars.com/api/?name=Priya+Sharma&size=150&background=f59e0b&color=fff",
  });

  const [classes] = useState([
    { id: 1, subject: "Data Structures", course: "B.Tech CSE", semester: "3rd", section: "A" },
    { id: 2, subject: "Data Structures", course: "B.Tech CSE", semester: "3rd", section: "B" },
    { id: 3, subject: "DBMS", course: "B.Tech CSE", semester: "4th", section: "A" },
    { id: 4, subject: "Web Development", course: "B.Tech CSE", semester: "4th", section: "B" },
  ]);

  const [students] = useState([
    { id: 1, name: "Rahul Kumar", rollNo: "101", attendance: 18, total: 20 },
    { id: 2, name: "Priya Verma", rollNo: "102", attendance: 19, total: 20 },
    { id: 3, name: "Arjun Singh", rollNo: "103", attendance: 16, total: 20 },
    { id: 4, name: "Neha Gupta", rollNo: "104", attendance: 20, total: 20 },
    { id: 5, name: "Vikram Patel", rollNo: "105", attendance: 14, total: 20 },
    { id: 6, name: "Anjali Sharma", rollNo: "106", attendance: 19, total: 20 },
    { id: 7, name: "Karan Singh", rollNo: "107", attendance: 17, total: 20 },
    { id: 8, name: "Divya Nair", rollNo: "108", attendance: 15, total: 20 },
  ]);

  const [selectedClass, setSelectedClass] = useState(classes[0]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendanceStatus, setAttendanceStatus] = useState(() => {
    const saved = localStorage.getItem("teacherAttendanceStatus");
    return saved ? JSON.parse(saved) : {};
  });

  const [activeTab, setActiveTab] = useState("mark");
  const [editingRecord, setEditingRecord] = useState(null);

  const [attendanceRecords, setAttendanceRecords] = useState(() => {
    const saved = localStorage.getItem("teacherAttendanceRecords");
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        date: "2025-03-10",
        subject: "Data Structures",
        section: "A",
        presentCount: 45,
        totalCount: 50,
      },
      {
        id: 2,
        date: "2025-03-09",
        subject: "DBMS",
        section: "A",
        presentCount: 48,
        totalCount: 50,
      },
      {
        id: 3,
        date: "2025-03-08",
        subject: "Web Development",
        section: "B",
        presentCount: 42,
        totalCount: 50,
      },
    ];
  });

  // Save attendance status to localStorage
  useEffect(() => {
    localStorage.setItem("teacherAttendanceStatus", JSON.stringify(attendanceStatus));
  }, [attendanceStatus]);

  // Save attendance records to localStorage
  useEffect(() => {
    localStorage.setItem("teacherAttendanceRecords", JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceStatus({
      ...attendanceStatus,
      [studentId]: status,
    });
  };

  const markAllPresent = () => {
    const newStatus = {};
    students.forEach((student) => {
      newStatus[student.id] = "present";
    });
    setAttendanceStatus(newStatus);
  };

  const markAllAbsent = () => {
    const newStatus = {};
    students.forEach((student) => {
      newStatus[student.id] = "absent";
    });
    setAttendanceStatus(newStatus);
  };

  const handleSubmitAttendance = () => {
    if (Object.keys(attendanceStatus).length === 0) {
      alert("Please mark attendance for at least one student");
      return;
    }
    alert(`Attendance submitted for ${selectedClass.subject} on ${selectedDate}`);
    setAttendanceStatus({});
  };

  const getAttendancePercentage = (attendance, total) => {
    return Math.round((attendance / total) * 100);
  };

  const getPercentageColor = (percentage) => {
    if (percentage >= 90) return "#10b981";
    if (percentage >= 75) return "#f59e0b";
    return "#ef4444";
  };

  const getStatusColor = (status) => {
    return status === "present" ? "#10b981" : "#ef4444";
  };

  const handleEditRecord = (record) => {
    setEditingRecord(record);
    setActiveTab("edit");
  };

  const handleUpdateRecord = () => {
    alert("Attendance record updated successfully");
    setEditingRecord(null);
    setActiveTab("records");
  };

  return (
    <div className="teacher-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Teacher Dashboard</h1>
        <p>Manage classes and mark attendance efficiently</p>
      </div>

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
                    setSelectedClass(classes.find((c) => c.id === parseInt(e.target.value)))
                  }
                >
                  {classes.map((cls) => (
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
                <div key={student.id} className="student-item" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <div className="student-info">
                    <div className="student-name">{student.name}</div>
                    <div className="student-rollno">Roll No: {student.rollNo}</div>
                  </div>

                  <div className="attendance-buttons">
                    <button
                      className={`attendance-btn present ${
                        attendanceStatus[student.id] === "present" ? "selected" : ""
                      }`}
                      onClick={() => handleAttendanceChange(student.id, "present")}
                    >
                      ✓ Present
                    </button>
                    <button
                      className={`attendance-btn absent ${
                        attendanceStatus[student.id] === "absent" ? "selected" : ""
                      }`}
                      onClick={() => handleAttendanceChange(student.id, "absent")}
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
                  Progress: <strong>{Math.round((Object.keys(attendanceStatus).length / students.length) * 100)}%</strong>
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
                  {attendanceRecords.map((record, idx) => (
                    <tr key={record.id} style={{ animationDelay: `${idx * 0.05}s` }}>
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
                          onClick={() => alert("View details for " + record.subject)}
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
                  {students.map((student, idx) => {
                    const percentage = getAttendancePercentage(student.attendance, student.total);
                    const absent = student.total - student.attendance;
                    return (
                      <tr key={student.id} style={{ animationDelay: `${idx * 0.05}s` }}>
                        <td className="student-name-report">{student.name}</td>
                        <td>{student.rollNo}</td>
                        <td>{student.total}</td>
                        <td className="present-count">{student.attendance}</td>
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
                <p className="summary-value">100%</p>
                <p className="summary-students">4 Students</p>
              </div>
              <div className="summary-card">
                <h4>Average Attendance</h4>
                <p className="summary-value">86%</p>
                <p className="summary-students">Across All</p>
              </div>
              <div className="summary-card">
                <h4>Low Attendance</h4>
                <p className="summary-value">70%</p>
                <p className="summary-students">1 Student</p>
              </div>
              <div className="summary-card">
                <h4>Total Classes</h4>
                <p className="summary-value">20</p>
                <p className="summary-students">This Semester</p>
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
                    {students.map((student, idx) => (
                      <div key={student.id} className="edit-student-item" style={{ animationDelay: `${idx * 0.05}s` }}>
                        <div className="edit-student-info">
                          <span className="edit-student-name">{student.name}</span>
                          <span className="edit-student-roll">{student.rollNo}</span>
                        </div>
                        <div className="edit-attendance-buttons">
                          <button className="edit-btn present">✓ Present</button>
                          <button className="edit-btn absent">✕ Absent</button>
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
    </div>
  );
}

export default TeacherDashboard;
