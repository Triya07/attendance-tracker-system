import AdminLayout from "../layouts/AdminLayout";
import "../styles/admin.css";

const recentUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Student",
    joined: "2024-04-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Student",
    joined: "2024-04-12",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael.brown@example.com",
    role: "Teacher",
    joined: "2024-04-10",
  },
];

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <h1>Admin Dashboard</h1>

      {/* Recent Users */}
      <div className="glass-panel">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "12px",
          }}
        >
          <h3>Recent Users</h3>
          <button
            style={{
              backgroundColor: "#4f46e5",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              padding: "6px 12px",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            View All
          </button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {recentUsers.map((user) => (
              <UserRow key={user.id} user={user} />
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

const UserRow = ({ user }) => (
  <tr>
    <td>{user.name}</td>
    <td>{user.email}</td>
    <td>
      <span
        className="badge"
        style={{
          backgroundColor:
            user.role === "Teacher" ? "#f97316" : "#14b8a6",
        }}
      >
        {user.role}
      </span>
    </td>
    <td>{user.joined}</td>
  </tr>
);

export default AdminDashboard;
