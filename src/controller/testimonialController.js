// import db from "../config/db.js";
// import multer from "multer";
// import path from "path";
// import fs from "fs";

// // --- File Upload Configuration ---
// const uploadDir = path.resolve("uploads/testimonials");
// if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadDir),
//   filename: (req, file, cb) => {
//     const uniqueName = `${Date.now()}-${file.originalname}`;
//     cb(null, uniqueName);
//   },
// });

// export const upload = multer({ storage });

// // --- Add New Testimonial ---
// export const addTestimonial = async (req, res) => {
//   try {
//     const { patient_name, message, rating, status } = req.body;

//     // Construct absolute URL for image
//     const serverUrl = `${req.protocol}://${req.get("host")}`;
//     const photo_url = req.file
//       ? `${serverUrl}/uploads/testimonials/${req.file.filename}`
//       : null;

//     if (!patient_name || !message || !rating || !status) {
//       return res
//         .status(400)
//         .json({ error: "All required fields must be provided." });
//     }

//     const [result] = await db.query(
//       "INSERT INTO testimonials (patient_name, message, photo_url, rating, status) VALUES (?, ?, ?, ?, ?)",
//       [patient_name, message, photo_url, rating, status]
//     );

//     res
//       .status(201)
//       .json({
//         message: "Testimonial added successfully!",
//         testimonial_id: result.insertId,
//       });
//   } catch (err) {
//     console.error("Error adding testimonial:", err);
//     res.status(500).json({ error: "Failed to add testimonial." });
//   }
// };

// // --- Get All Testimonials ---
// export const getTestimonials = async (req, res) => {
//   try {
//     const [rows] = await db.query(
//       "SELECT * FROM testimonials ORDER BY testimonial_id DESC"
//     );
//     res.json(rows);
//   } catch (err) {
//     console.error("Error fetching testimonials:", err);
//     res.status(500).json({ error: "Failed to fetch testimonials." });
//   }
// };

// // --- Delete Testimonial ---
// export const deleteTestimonial = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const [rows] = await db.query(
//       "SELECT photo_url FROM testimonials WHERE testimonial_id = ?",
//       [id]
//     );
//     if (rows.length === 0)
//       return res.status(404).json({ error: "Testimonial not found." });

//     // Extract file path from full URL
//     const photoUrl = rows[0].photo_url;
//     if (photoUrl) {
//       const relativePath = photoUrl.replace(`${req.protocol}://${req.get("host")}`, ".");
//       const photoPath = path.resolve(relativePath);
//       if (fs.existsSync(photoPath)) fs.unlinkSync(photoPath);
//     }

//     await db.query("DELETE FROM testimonials WHERE testimonial_id = ?", [id]);
//     res.json({ message: "Testimonial deleted successfully." });
//   } catch (err) {
//     console.error("Error deleting testimonial:", err);
//     res.status(500).json({ error: "Failed to delete testimonial." });
//   }
// };



import db from "../config/db.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads directory exists
const uploadDir = path.resolve("uploads/testimonials");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Configure multer for saving photos
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

export const upload = multer({ storage });

// ✅ Add a new testimonial
export const addTestimonial = async (req, res) => {
  try {
    console.log("🟢 Incoming form data:", req.body);
    console.log("🟢 Uploaded file:", req.file);

    const { patient_name, message, rating, status } = req.body;

    if (!patient_name || !message || !rating || !status) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const photo_url = req.file
      ? `/uploads/testimonials/${req.file.filename}`
      : null;

    const [result] = await db.query(
      "INSERT INTO testimonials (patient_name, message, photo_url, rating, status) VALUES (?, ?, ?, ?, ?)",
      [patient_name, message, photo_url, rating, status]
    );

    res.status(201).json({
      message: "✅ Testimonial saved successfully",
      testimonial_id: result.insertId,
    });
  } catch (err) {
    console.error("❌ Error saving testimonial:", err);
    res.status(500).json({ error: "Failed to save testimonial" });
  }
};

// ✅ Get all testimonials
export const getTestimonials = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM testimonials ORDER BY testimonial_id DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching testimonials:", err);
    res.status(500).json({ error: "Failed to fetch testimonials" });
  }
};

// ✅ Delete testimonial
export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      "SELECT photo_url FROM testimonials WHERE testimonial_id = ?",
      [id]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "Testimonial not found." });

    // Delete image file if exists
    const photoUrl = rows[0].photo_url;
    if (photoUrl) {
      const filePath = path.resolve(`.${photoUrl}`);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await db.query("DELETE FROM testimonials WHERE testimonial_id = ?", [id]);
    res.json({ message: "✅ Testimonial deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting testimonial:", err);
    res.status(500).json({ error: "Failed to delete testimonial." });
  }
};
