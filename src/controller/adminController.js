import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js"; // ✅ use pool, not db

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // 1️⃣ Fetch admin from DB (LIMIT 1 is important for serverless)
    const [rows] = await pool.query(
      "SELECT admin_id, username, email, password_hash FROM admins WHERE email = ? LIMIT 1",
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const admin = rows[0];

    // 2️⃣ Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 3️⃣ Create JWT Token
    const token = jwt.sign(
      {
        id: admin.admin_id,
        email: admin.email,
        username: admin.username,
      },
      process.env.JWT_SECRET, // ❗ must be set in Vercel env
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    // 4️⃣ Send response
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
