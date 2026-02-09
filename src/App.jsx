import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Routes>
      {/* Default route */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Login */}
      <Route path="/login" element={<Login />} />

      {/* Future routes (placeholders) */}
      <Route path="/student/dashboard" element={<h1>Student Dashboard</h1>} />
      <Route path="/teacher/dashboard" element={<h1>Teacher Dashboard</h1>} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />

    </Routes>
  );
}

export default App;
