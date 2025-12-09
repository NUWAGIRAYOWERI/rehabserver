import pool from "../config/db.js";
import path from "path";
import fs from "fs";

// Ensure uploads directory exists
const uploadDir = path.resolve("uploads/services");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// ========================================================
// GET ALL SERVICES
// ========================================================
export const getAllServices = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM services ORDER BY created_at DESC"
    );

    // No need to prepend protocol — return raw DB path
    res.json(rows);
  } catch (err) {
    console.error("Error fetching services:", err);
    res.status(500).json({ message: "Failed to fetch services" });
  }
};

// ========================================================
// GET SERVICE BY ID
// ========================================================
export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      "SELECT * FROM services WHERE service_id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching service by ID:", err);
    res.status(500).json({ message: "Failed to fetch service" });
  }
};

// ========================================================
// GET SERVICE BY SLUG
// ========================================================
export const getServiceBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const [rows] = await pool.query("SELECT * FROM services WHERE slug = ?", [
      slug,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching service by slug:", err);
    res.status(500).json({ message: "Failed to fetch service" });
  }
};

// ========================================================
// CREATE SERVICE
// ========================================================
export const createService = async (req, res) => {
  try {
    const { name, description, long_description, status, category, icon } =
      req.body;

    const image_filename = req.file ? req.file.filename : null;

    if (!name || !description || !status || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const slug = name.toLowerCase().replace(/\s+/g, "-");

    const image_url = image_filename
      ? `/uploads/services/${image_filename}`
      : null;

    const [result] = await pool.query(
      `INSERT INTO services 
        (name, slug, description, long_description, status, category, icon, image_url, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        name,
        slug,
        description,
        long_description || "",
        status,
        category,
        icon || null,
        image_url,
      ]
    );

    res.status(201).json({
      message: "Service created successfully",
      serviceId: result.insertId,
      slug,
      image_url,
    });
  } catch (err) {
    console.error("Error creating service:", err);
    res.status(500).json({ message: "Failed to create service" });
  }
};

// ========================================================
// UPDATE SERVICE
// ========================================================
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, long_description, status, category, icon } =
      req.body;

    const image_filename = req.file ? req.file.filename : null;

    const slug = name ? name.toLowerCase().replace(/\s+/g, "-") : null;

    let query = `
      UPDATE services 
      SET name=?, slug=?, description=?, long_description=?, status=?, category=?, icon=?
    `;

    const params = [
      name,
      slug,
      description,
      long_description,
      status,
      category,
      icon,
    ];

    if (image_filename) {
      query += `, image_url=?`;
      params.push(`/uploads/services/${image_filename}`);
    }

    query += ` WHERE service_id=?`;
    params.push(id);

    await pool.query(query, params);

    res.json({
      message: "Service updated successfully",
      slug,
      image_url: image_filename ? `/uploads/services/${image_filename}` : null,
    });
  } catch (err) {
    console.error("Error updating service:", err);
    res.status(500).json({ message: "Failed to update service" });
  }
};

// ========================================================
// DELETE SERVICE
// ========================================================
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch image URL to delete file
    const [rows] = await pool.query(
      "SELECT image_url FROM services WHERE service_id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Service not found" });
    }

    const filePath = rows[0].image_url
      ? path.resolve(`.${rows[0].image_url}`)
      : null;

    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await pool.query("DELETE FROM services WHERE service_id = ?", [id]);

    res.json({ message: "Service deleted successfully" });
  } catch (err) {
    console.error("Error deleting service:", err);
    res.status(500).json({ message: "Failed to delete service" });
  }
};
