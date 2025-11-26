import express from "express";
import db from "../config/db.js";

const router = express.Router();

/**
 * CREATE new appointment
 * POST /appointments
 */
router.post("/", async (req, res) => {
  const { patientName, service, contact, time, status } = req.body;

  try {
    if (!patientName || !service || !contact || !time) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const formattedTime = new Date(time).toISOString().slice(0, 19).replace("T", " ");

    const [result] = await db.query(
      `INSERT INTO appointments (patient_name, service, contact, appointment_time, status)
       VALUES (?, ?, ?, ?, ?)`,
      [patientName, service, contact, formattedTime, status || "Upcoming"]
    );

    const [rows] = await db.query(`SELECT * FROM appointments WHERE id = ?`, [result.insertId]);

    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: rows[0],
    });
  } catch (err) {
    console.error("Error creating appointment:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


/**
 * GET all appointments
 * GET /appointments
 */
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM appointments ORDER BY appointment_time DESC");

    // Normalize column names to match frontend expectations
    const normalized = rows.map((r) => ({
      id: r.id,
      patientName: r.patient_name,
      service: r.service,
      contact: r.contact,
      time: r.appointment_time,
      status: r.status ? r.status.charAt(0).toUpperCase() + r.status.slice(1).toLowerCase() : "Upcoming",
    }));

    res.json({
      success: true,
      data: normalized,
    });
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({
      success: false,
      message: "Server error fetching appointments",
    });
  }
});



/**
 * GET single appointment by ID
 * GET /api/appointments/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM appointments WHERE id = ?`, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ data: rows[0] });
  } catch (err) {
    console.error("Error fetching appointment:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * UPDATE appointment
 * PUT /api/appointments/:id
 */
router.put("/:id", async (req, res) => {
  const { patientName, service, contact, time, status } = req.body;

  try {
    const formattedTime = time ? new Date(time).toISOString().slice(0, 19).replace("T", " ") : null;

    const [result] = await db.query(
      `UPDATE appointments 
       SET patient_name = ?, service = ?, contact = ?, appointment_time = ?, status = ?
       WHERE id = ?`,
      [patientName, service, contact, formattedTime, status, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const [updated] = await db.query(`SELECT * FROM appointments WHERE id = ?`, [req.params.id]);
    res.json({ message: "Appointment updated successfully", data: updated[0] });
  } catch (err) {
    console.error("Error updating appointment:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * DELETE appointment
 * DELETE /api/appointments/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    console.log("DELETE HIT:", req.params.id);

    const [result] = await db.query(
      "DELETE FROM appointments WHERE id = ?",
      [req.params.id]
    );

    console.log("MYSQL result:", result);

    if (result.affectedRows === 0) {
      return res.json({
        success: false,
        message: "Appointment not found",
      });
    }

    return res.json({
      success: true,
      message: "Appointment deleted",
    });

  } catch (error) {
    console.error("DELETE ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});


export default router;
