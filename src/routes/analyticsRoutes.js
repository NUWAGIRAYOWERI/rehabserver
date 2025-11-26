import express from "express";
import db from "../config/db.js";

const router = express.Router();

// ✅ Track a service view
router.post("/track-visit", async (req, res) => {
  const { serviceSlug } = req.body;

  try {
    await db.query(
      "INSERT INTO service_visits (service_slug, visit_time) VALUES (?, NOW())",
      [serviceSlug]
    );
    res.status(200).json({ message: "Visit tracked successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error tracking visit" });
  }
});

// ✅ Get aggregated view counts
router.get("/visits-summary", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.name AS service, COUNT(v.id) AS views
      FROM service_visits v
      JOIN services s ON s.slug = v.service_slug
      GROUP BY s.name
      ORDER BY views DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching analytics" });
  }
});

export default router;
