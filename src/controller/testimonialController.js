// import db from "../config/db.js";
// import multer from "multer";
// import path from "path";
// import fs from "fs";

// // Ensure uploads directory exists
// const uploadDir = path.resolve("uploads/testimonials");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Multer storage config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadDir),
//   filename: (req, file, cb) => {
//     const uniqueName = `${Date.now()}-${file.originalname}`;
//     cb(null, uniqueName);
//   },
// });

// // Multer upload instance
// export const upload = multer({ storage });

// // Add testimonial
// // export const addTestimonial = async (req, res) => {
// //   try {
// //     const { patient_name, message, rating, status } = req.body;

// //     if (!patient_name || !message || !rating || !status) {
// //       return res.status(400).json({ error: "All fields are required." });
// //     }

// //     const photo_url = req.file
// //       ? `/uploads/testimonials/${req.file.filename}`
// //       : null;

// //     const [result] = await db.query(
// //       "INSERT INTO testimonials (patient_name, message, photo_url, rating, status) VALUES (?, ?, ?, ?, ?)",
// //       [patient_name, message, parseInt(rating, 10), status, photo_url],
// //     );

// //     res.status(201).json({
// //       message: "Testimonial saved successfully",
// //       testimonial_id: result.insertId,
// //       photo_url,
// //     });
// //   } catch (err) {
// //     console.error("Error saving testimonial:", err);
// //     res.status(500).json({ error: "Failed to save testimonial" });
// //   }
// // };

// // =========================
// // ✅ ADD TESTIMONIAL
// // =========================
// export const addTestimonial = async (req, res) => {
//   try {
//     console.log("🟢 BODY:", req.body);
//     console.log("🟢 FILE:", req.file);

//     const { patient_name, message, rating, status } = req.body;

//     if (!patient_name || !message || !rating || !status) {
//       return res.status(400).json({
//         error: "All fields are required",
//       });
//     }

//     // ✅ Normalize status (FIX)
//     const normalizedStatus =
//       status?.toLowerCase() === "approved" ? "Approved" : "Pending";

//     // ✅ File handling
//     let photo_url = null;
//     if (req.file) {
//       photo_url = `/uploads/testimonials/${req.file.filename}`;
//     }

//     const [result] = await db.query(
//       "INSERT INTO testimonials (patient_name, message, photo_url, rating, status) VALUES (?, ?, ?, ?, ?)",
//       [
//         patient_name,
//         message,
//         photo_url,
//         parseInt(rating, 10),
//         normalizedStatus,
//       ],
//     );

//     res.status(201).json({
//       message: "✅ Saved successfully",
//       testimonial_id: result.insertId,
//       photo_url,
//     });
//   } catch (err) {
//     console.error("❌ FULL ERROR:", err);

//     res.status(500).json({
//       error: err.message,
//     });
//   }
// };
// // Get all testimonials
// export const getTestimonials = async (req, res) => {
//   try {
//     const [rows] = await db.query(
//       "SELECT * FROM testimonials ORDER BY testimonial_id DESC",
//     );
//     res.status(200).json(rows);
//   } catch (err) {
//     console.error("Error fetching testimonials:", err);
//     res.status(500).json({ error: "Failed to fetch testimonials" });
//   }
// };

// // Delete testimonial
// export const deleteTestimonial = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const [rows] = await db.query(
//       "SELECT photo_url FROM testimonials WHERE testimonial_id = ?",
//       [id],
//     );

//     if (rows.length === 0)
//       return res.status(404).json({ error: "Testimonial not found." });

//     const photoUrl = rows[0].photo_url;
//     if (photoUrl) {
//       const filePath = path.resolve(`.${photoUrl}`);
//       if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
//     }

//     await db.query("DELETE FROM testimonials WHERE testimonial_id = ?", [id]);
//     res.json({ message: "Testimonial deleted successfully" });
//   } catch (err) {
//     console.error("Error deleting testimonial:", err);
//     res.status(500).json({ error: "Failed to delete testimonial." });
//   }
// };

// // Update testimonial
// export const updateTestimonial = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { patient_name, message, rating, status } = req.body;

//     const photo_url = req.file
//       ? `/uploads/testimonials/${req.file.filename}`
//       : null;

//     const [existing] = await db.query(
//       "SELECT photo_url FROM testimonials WHERE testimonial_id = ?",
//       [id],
//     );

//     if (existing.length === 0)
//       return res.status(404).json({ error: "Testimonial not found." });

//     // Delete old photo if new one is uploaded
//     if (photo_url && existing[0].photo_url) {
//       const filePath = path.resolve(`.${existing[0].photo_url}`);
//       if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
//     }

//     await db.query(
//       `UPDATE testimonials
//        SET patient_name = ?, message = ?, rating = ?, status = ?, photo_url = COALESCE(?, photo_url)
//        WHERE testimonial_id = ?`,
//       [patient_name, message, parseInt(rating, 10), status, photo_url, id],
//     );

//     res.json({ message: "Testimonial updated successfully" });
//   } catch (err) {
//     console.error("Error updating testimonial:", err);
//     res.status(500).json({ error: "Failed to update testimonial." });
//   }
// };

import db from "../config/db.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads directory exists
const uploadDir = path.resolve("uploads/testimonials");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// Multer upload instance
export const upload = multer({ storage });

// =========================
// ✅ ADD TESTIMONIAL
// =========================
export const addTestimonial = async (req, res) => {
  try {
    console.log("🟢 BODY:", req.body);
    console.log("🟢 FILE:", req.file);

    const { patient_name, message, rating, status } = req.body;

    if (!patient_name || !message || !rating || !status) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    // ✅ Normalize status (FIX)
    // const normalizedStatus =
    //   status?.toLowerCase() === "approved" ? "Approved" : "Pending";

    // ✅ File handling
    let photo_url = null;
    if (req.file) {
      photo_url = `/uploads/testimonials/${req.file.filename}`;
    }

    const [result] = await db.query(
      "INSERT INTO testimonials (patient_name, message, photo_url, rating ) VALUES (?, ?, ?, ?)",
      [patient_name, message, photo_url, parseInt(rating, 10)],
    );

    res.status(201).json({
      message: "✅ Saved successfully",
      testimonial_id: result.insertId,
      photo_url,
    });
  } catch (err) {
    console.error("❌ FULL ERROR:", err);

    res.status(500).json({
      error: err.message,
    });
  }
};

// =========================
// ✅ GET TESTIMONIALS
// =========================
export const getTestimonials = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM testimonials ORDER BY testimonial_id DESC",
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching testimonials:", err);
    res.status(500).json({ error: "Failed to fetch testimonials" });
  }
};

// =========================
// ✅ DELETE TESTIMONIAL
// =========================
export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT photo_url FROM testimonials WHERE testimonial_id = ?",
      [id],
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "Testimonial not found." });

    const photoUrl = rows[0].photo_url;

    // Delete image file if exists
    if (photoUrl) {
      const filePath = path.resolve(`.${photoUrl}`);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await db.query("DELETE FROM testimonials WHERE testimonial_id = ?", [id]);

    res.json({ message: "Testimonial deleted successfully" });
  } catch (err) {
    console.error("Error deleting testimonial:", err);
    res.status(500).json({ error: "Failed to delete testimonial." });
  }
};

// =========================
// ✅ UPDATE TESTIMONIAL
// =========================
export const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { patient_name, message, rating, status } = req.body;

    // ✅ Normalize status (FIX)
    // const normalizedStatus =
    //   status?.toLowerCase() === "approved" ? "Approved" : "Pending";

    const photo_url = req.file
      ? `/uploads/testimonials/${req.file.filename}`
      : null;

    const [existing] = await db.query(
      "SELECT photo_url FROM testimonials WHERE testimonial_id = ?",
      [id],
    );

    if (existing.length === 0)
      return res.status(404).json({ error: "Testimonial not found." });

    // Delete old photo if new one is uploaded
    if (photo_url && existing[0].photo_url) {
      const filePath = path.resolve(`.${existing[0].photo_url}`);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await db.query(
      `UPDATE testimonials 
       SET patient_name = ?, message = ?, rating = ?, photo_url = COALESCE(?, photo_url) 
       WHERE testimonial_id = ?`,
      [patient_name, message, parseInt(rating, 10), photo_url, id],
    );

    res.json({ message: "Testimonial updated successfully" });
  } catch (err) {
    console.error("Error updating testimonial:", err);
    res.status(500).json({ error: "Failed to update testimonial." });
  }
};
