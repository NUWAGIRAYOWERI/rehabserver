import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const [rows] = await db.query(
      "SELECT admin_id, username, email, password_hash FROM admins WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const admin = rows[0];

    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: admin.admin_id, email: admin.email },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "1d" }
    );

    return res.json({
      message: "Login successful",
      token,
      admin: {
        id: admin.admin_id,
        username: admin.username,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Server login error:", error);
    return res.status(500).json({
      message: "Server error during login",
      error: error.message,
    });
  }
};
