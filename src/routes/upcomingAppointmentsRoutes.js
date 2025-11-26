import express from "express";
import db from "../config/db.js";

const router = express.Router();

// GET /upcoming-appointments
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, patient_name, service, contact, appointment_time, status
       FROM appointments
       WHERE appointment_time BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 48 HOUR)
       ORDER BY appointment_time ASC`
    );

    if (rows.length === 0) {
      return res.status(200).json({ message: "No upcoming appointments in the next 48 hours.", data: [] });
    }

    res.status(200).json({ message: "Upcoming appointments retrieved successfully.", data: rows });
  } catch (err) {
    console.error("Error fetching upcoming appointments:", err);
    res.status(500).json({ message: "Server error while fetching appointments." });
  }
});

export default router;
