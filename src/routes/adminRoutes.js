import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import db from "../config/db.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query("SELECT * FROM admins WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const admin = rows[0];
    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: admin.admin_id, email: admin.email },
      process.env.JWT_SECRET || "fallbackSecret",
      { expiresIn: "1h" }
    );

    res.json({ token, admin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
