import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";
import PrimaryButton from "../components/PrimaryButton";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const navigate = useNavigate();

  const handleLogin = () => {
    if (!email || !password || !role) {
      alert("Please fill all fields");
      return;
    }

    if (role === "student") navigate("/student/dashboard");
    else if (role === "teacher") navigate("/teacher/dashboard");
    else if (role === "admin") navigate("/admin/dashboard");
  };

  return (
    <AuthLayout>
      <h2 style={{ textAlign: "center", marginBottom: "24px" }}>
        Welcome Back!
      </h2>

      <InputField
        label="Institute Email-ID"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <InputField
        label="Password"
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <SelectField
        label="Select Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        options={[
          { value: "", label: "Select Role" },
          { value: "student", label: "Student" },
          { value: "teacher", label: "Teacher" },
          { value: "admin", label: "Admin" },
        ]}
      />

      <PrimaryButton text="Login" onClick={handleLogin} />
    </AuthLayout>
  );
};

export default Login;
