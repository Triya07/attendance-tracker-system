import { useState, useEffect } from "react";
import "../styles/admin-dashboard.css";

function AdminDashboard() {
  const [adminData] = useState({
    name: "Admin User",
    adminId: "ADMIN001",
    email: "admin@attendance.com",
    role: "System Admin",
    profilePhoto: "https://ui-avatars.com/api/?name=Admin+User&size=150&background=4f46e5&color=fff",
  });

  const [activeTab, setActiveTab] = useState("students");
  
  // Initialize state from localStorage or use default data
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem("students");
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "Rahul Kumar", email: "rahul@student.com", course: "B.Tech CSE", semester: "5", section: "A" },
      { id: 2, name: "Priya Verma", email: "priya@student.com", course: "B.Tech CSE", semester: "5", section: "B" },
      { id: 3, name: "Arjun Singh", email: "arjun@student.com", course: "B.Tech CSE", semester: "4", section: "A" },
    ];
  });

  const [teachers, setTeachers] = useState(() => {
    const saved = localStorage.getItem("teachers");
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "Dr. Priya Sharma", department: "CSE", subjects: ["Data Structures", "DBMS"] },
      { id: 2, name: "Prof. Rajesh Patel", department: "CSE", subjects: ["Web Development", "JavaScript"] },
      { id: 3, name: "Dr. Anjali Mishra", department: "CSE", subjects: ["Computer Networks", "Operating Systems"] },
    ];
  });

  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem("courses");
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "Data Structures", code: "CS301", semester: "3", assignedTeacher: "Dr. Priya Sharma" },
      { id: 2, name: "DBMS", code: "CS401", semester: "4", assignedTeacher: "Dr. Priya Sharma" },
      { id: 3, name: "Web Development", code: "CS402", semester: "4", assignedTeacher: "Prof. Rajesh Patel" },
    ];
  });

  // Save students to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  // Save teachers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("teachers", JSON.stringify(teachers));
  }, [teachers]);

  // Save courses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("courses", JSON.stringify(courses));
  }, [courses]);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});

  // Summary stats
  const stats = [
    { label: "Total Students", value: students.length, color: "blue", icon: "👥" },
    { label: "Total Teachers", value: teachers.length, color: "orange", icon: "👨‍🏫" },
    { label: "Total Courses", value: courses.length, color: "green", icon: "📚" },
  ];

  const openModal = (type, item = null) => {
    setModalType(type);
    if (item) {
      setEditingId(item.id);
      setFormData(item);
    } else {
      setFormData({});
      setEditingId(null);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType(null);
    setEditingId(null);
    setFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveStudent = () => {
    if (editingId) {
      setStudents(students.map(s => s.id === editingId ? { ...s, ...formData } : s));
    } else {
      setStudents([...students, { id: Date.now(), ...formData }]);
    }
    closeModal();
  };

  const handleSaveTeacher = () => {
    if (editingId) {
      setTeachers(teachers.map(t => t.id === editingId ? { ...t, ...formData } : t));
    } else {
      setTeachers([...teachers, { id: Date.now(), ...formData }]);
    }
    closeModal();
  };

  const handleSaveCourse = () => {
    if (editingId) {
      setCourses(courses.map(c => c.id === editingId ? { ...c, ...formData } : c));
    } else {
      setCourses([...courses, { id: Date.now(), ...formData }]);
    }
    closeModal();
  };

  const deleteStudent = (id) => {
    if (confirm("Are you sure you want to delete this student?")) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const deleteTeacher = (id) => {
    if (confirm("Are you sure you want to delete this teacher?")) {
      setTeachers(teachers.filter(t => t.id !== id));
    }
  };

  const deleteCourse = (id) => {
    if (confirm("Are you sure you want to delete this course?")) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage system resources and user accounts</p>
      </div>

      {/* Admin Profile Section */}
      <div className="glass-panel profile-section">
        <div className="profile-container">
          <div className="profile-image-wrapper">
            <img src={adminData.profilePhoto} alt="Admin" className="profile-image" />
            <div className="profile-badge">Admin</div>
          </div>
          <div className="profile-info">
            <h2 className="profile-name">{adminData.name}</h2>
            <div className="profile-details">
              <div className="detail-item">
                <span className="detail-label">Admin ID</span>
                <span className="detail-value">{adminData.adminId}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email</span>
                <span className="detail-value">{adminData.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Role</span>
                <span className="detail-value">{adminData.role}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className={`stat-card stat-card-${stat.color}`} style={{ animationDelay: `${idx * 0.1}s` }}>
            <div className="stat-icon">{stat.icon}</div>
            <span className="stat-label">{stat.label}</span>
            <h2 className="stat-value">{stat.value}</h2>
          </div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="nav-tabs">
        <button
          className={`nav-tab ${activeTab === "students" ? "active" : ""}`}
          onClick={() => setActiveTab("students")}
        >
          <span className="tab-icon">👥</span> Manage Students
        </button>
        <button
          className={`nav-tab ${activeTab === "teachers" ? "active" : ""}`}
          onClick={() => setActiveTab("teachers")}
        >
          <span className="tab-icon">👨‍🏫</span> Manage Teachers
        </button>
        <button
          className={`nav-tab ${activeTab === "courses" ? "active" : ""}`}
          onClick={() => setActiveTab("courses")}
        >
          <span className="tab-icon">📚</span> Manage Courses
        </button>
      </div>

      {/* STUDENTS TAB */}
      {activeTab === "students" && (
        <div className="tab-content">
          <div className="glass-panel">
            <div className="section-header">
              <h3>Manage Students</h3>
              <button className="add-btn" onClick={() => openModal("student")}>
                ➕ Add Student
              </button>
            </div>

            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Course</th>
                    <th>Semester</th>
                    <th>Section</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, idx) => (
                    <tr key={student.id} style={{ animationDelay: `${idx * 0.05}s` }}>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>{student.course}</td>
                      <td>{student.semester}</td>
                      <td>{student.section}</td>
                      <td>
                        <button
                          className="action-btn edit"
                          onClick={() => openModal("student", student)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => deleteStudent(student.id)}
                        >
                          🗑️ Delete
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

      {/* TEACHERS TAB */}
      {activeTab === "teachers" && (
        <div className="tab-content">
          <div className="glass-panel">
            <div className="section-header">
              <h3>Manage Teachers</h3>
              <button className="add-btn" onClick={() => openModal("teacher")}>
                ➕ Add Teacher
              </button>
            </div>

            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Subjects</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher, idx) => (
                    <tr key={teacher.id} style={{ animationDelay: `${idx * 0.05}s` }}>
                      <td>{teacher.name}</td>
                      <td>{teacher.department}</td>
                      <td>
                        <div className="subjects-list">
                          {teacher.subjects.map((subject, i) => (
                            <span key={i} className="subject-tag">{subject}</span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <button
                          className="action-btn edit"
                          onClick={() => openModal("teacher", teacher)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => deleteTeacher(teacher.id)}
                        >
                          🗑️ Delete
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

      {/* COURSES TAB */}
      {activeTab === "courses" && (
        <div className="tab-content">
          <div className="glass-panel">
            <div className="section-header">
              <h3>Manage Courses / Subjects</h3>
              <button className="add-btn" onClick={() => openModal("course")}>
                ➕ Add Course
              </button>
            </div>

            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Subject Name</th>
                    <th>Subject Code</th>
                    <th>Semester</th>
                    <th>Assigned Teacher</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course, idx) => (
                    <tr key={course.id} style={{ animationDelay: `${idx * 0.05}s` }}>
                      <td>{course.name}</td>
                      <td className="code-cell">{course.code}</td>
                      <td>{course.semester}</td>
                      <td>{course.assignedTeacher}</td>
                      <td>
                        <button
                          className="action-btn edit"
                          onClick={() => openModal("course", course)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => deleteCourse(course.id)}
                        >
                          🗑️ Delete
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

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {editingId ? "Edit" : "Add"}{" "}
                {modalType === "student"
                  ? "Student"
                  : modalType === "teacher"
                  ? "Teacher"
                  : "Course"}
              </h2>
              <button className="modal-close" onClick={closeModal}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              {modalType === "student" && (
                <div className="form-group-container">
                  <div className="form-group">
                    <label>Student Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleInputChange}
                      placeholder="Enter student name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ""}
                      onChange={handleInputChange}
                      placeholder="Enter email"
                    />
                  </div>
                  <div className="form-group">
                    <label>Course / Department</label>
                    <input
                      type="text"
                      name="course"
                      value={formData.course || ""}
                      onChange={handleInputChange}
                      placeholder="e.g., B.Tech CSE"
                    />
                  </div>
                  <div className="form-group">
                    <label>Semester</label>
                    <input
                      type="text"
                      name="semester"
                      value={formData.semester || ""}
                      onChange={handleInputChange}
                      placeholder="e.g., 5"
                    />
                  </div>
                  <div className="form-group">
                    <label>Section</label>
                    <input
                      type="text"
                      name="section"
                      value={formData.section || ""}
                      onChange={handleInputChange}
                      placeholder="e.g., A"
                    />
                  </div>
                </div>
              )}

              {modalType === "teacher" && (
                <div className="form-group-container">
                  <div className="form-group">
                    <label>Teacher Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleInputChange}
                      placeholder="Enter teacher name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Department</label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department || ""}
                      onChange={handleInputChange}
                      placeholder="e.g., CSE"
                    />
                  </div>
                  <div className="form-group">
                    <label>Subjects Assigned (comma separated)</label>
                    <input
                      type="text"
                      name="subjects"
                      value={Array.isArray(formData.subjects) ? formData.subjects.join(", ") : formData.subjects || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, subjects: e.target.value.split(",").map(s => s.trim()) })
                      }
                      placeholder="e.g., Data Structures, DBMS"
                    />
                  </div>
                </div>
              )}

              {modalType === "course" && (
                <div className="form-group-container">
                  <div className="form-group">
                    <label>Subject Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleInputChange}
                      placeholder="Enter subject name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Subject Code</label>
                    <input
                      type="text"
                      name="code"
                      value={formData.code || ""}
                      onChange={handleInputChange}
                      placeholder="e.g., CS301"
                    />
                  </div>
                  <div className="form-group">
                    <label>Semester</label>
                    <input
                      type="text"
                      name="semester"
                      value={formData.semester || ""}
                      onChange={handleInputChange}
                      placeholder="e.g., 3"
                    />
                  </div>
                  <div className="form-group">
                    <label>Assigned Teacher</label>
                    <input
                      type="text"
                      name="assignedTeacher"
                      value={formData.assignedTeacher || ""}
                      onChange={handleInputChange}
                      placeholder="Enter teacher name"
                    />
                  </div>
                </div>
              )}

            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeModal}>
                Cancel
              </button>
              <button
                className="btn-save"
                onClick={
                  modalType === "student"
                    ? handleSaveStudent
                    : modalType === "teacher"
                    ? handleSaveTeacher
                    : handleSaveCourse
                }
              >
                {editingId ? "Update" : "Add"} {modalType?.charAt(0).toUpperCase() + modalType?.slice(1)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
