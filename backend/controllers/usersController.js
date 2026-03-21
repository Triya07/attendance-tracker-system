const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const VALID_ROLES = ["student", "teacher", "admin"];

const normalizeEmail = (email = "") => email.trim().toLowerCase();

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const normalizedEmail = normalizeEmail(email);
    const normalizedRole = (role || "student").toLowerCase();
    const normalizedName = (name || "").trim();

    if (!normalizedName || !normalizedEmail || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    if (!VALID_ROLES.includes(normalizedRole)) {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password: hashedPassword,
      role: normalizedRole,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch {
    res.status(500).json({ message: "Failed to register user" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const normalizedEmail = normalizeEmail(email);
    const selectedRole = role ? role.toLowerCase() : "";

    if (!normalizedEmail || !password || !selectedRole) {
      return res.status(400).json({ message: "Email, password and role are required" });
    }

    if (!VALID_ROLES.includes(selectedRole)) {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const effectiveRole = user.role || "student";

    if (!user.role) {
      user.role = effectiveRole;
      await user.save();
    }

    if (effectiveRole !== selectedRole) {
      return res.status(403).json({ message: "Role mismatch for this account" });
    }

    const token = jwt.sign(
      { id: user._id, role: effectiveRole },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: effectiveRole,
      token,
    });
  } catch {
    res.status(500).json({ message: "Login failed" });
  }
};

module.exports = { registerUser, loginUser };