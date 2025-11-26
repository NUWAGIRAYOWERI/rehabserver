// import db from "../config/db.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// // 🟢 Login Admin
// export const loginAdmin = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     if (!username || !password)
//       return res.status(400).json({ message: "Username and password are required" });

//     // ✅ Find admin by username or email
//     const [rows] = await db.query(
//       "SELECT * FROM admins WHERE username = ? OR email = ?",
//       [username, username]
//     );

//     if (rows.length === 0)
//       return res.status(404).json({ message: "Admin not found" });

//     const admin = rows[0];

//     // ✅ Verify password
//     const valid = await bcrypt.compare(password, admin.password_hash);
//     if (!valid) return res.status(401).json({ message: "Invalid credentials" });

//     // ✅ Generate JWT
//     const token = jwt.sign(
//       {
//         id: admin.admin_id,
//         username: admin.username,
//         email: admin.email,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: process.env.JWT_EXPIRES_IN }
//     );

//     // ✅ Update last login time
//     await db.query("UPDATE admins SET last_login = NOW() WHERE admin_id = ?", [
//       admin.admin_id,
//     ]);

//     res.status(200).json({
//       message: "Login successful",
//       token,
//       admin: {
//         id: admin.admin_id,
//         username: admin.username,
//         email: admin.email,
//       },
//     });
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };



import bcrypt from "bcrypt"; 
import jwt from "jsonwebtoken";
import db from "../config/db.js";

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
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
