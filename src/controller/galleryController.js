// import db from "../config/db.js";
// import multer from "multer";
// import path from "path";
// import fs from "fs";

// // Ensure uploads/gallery folder exists
// const uploadDir = "uploads/gallery";
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Multer storage config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = `${Date.now()}-${file.originalname}`;
//     cb(null, uniqueName);
//   },
// });

// export const upload = multer({ storage });

// // Upload new image
// export const uploadImage = async (req, res) => {
//   try {
//     const { title, category, uploaded_by } = req.body;
//     const imageFile = req.file;

//     if (!imageFile) {
//       return res.status(400).json({ error: "No image uploaded" });
//     }

//     const imageUrl = `/uploads/gallery/${imageFile.filename}`;
//     const uploadedAt = new Date();

//     const [result] = await db.query(
//       `INSERT INTO gallery_images (title, image_url, category, uploaded_by, uploaded_at)
//        VALUES (?, ?, ?, ?, ?)`,
//       [title, imageUrl, category, uploaded_by || 1, uploadedAt]
//     );

//     res.status(201).json({
//       message: "Image uploaded successfully",
//       image_id: result.insertId,
//       image_url: imageUrl,
//     });
//   } catch (error) {
//     console.error("Upload error:", error);
//     res.status(500).json({ error: "Failed to upload image" });
//   }
// };

// // Get all images
// export const getAllImages = async (req, res) => {
//   try {
//     const [rows] = await db.query(
//       "SELECT * FROM gallery_images ORDER BY uploaded_at DESC"
//     );
//     res.json(rows);
//   } catch (error) {
//     console.error("Fetch error:", error);
//     res.status(500).json({ error: "Failed to fetch images" });
//   }
// };




// import db from "../config/db.js";
// import multer from "multer";
// import path from "path";

// // Configure multer storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/gallery");
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = `${Date.now()}-${file.originalname}`;
//     cb(null, uniqueName);
//   },
// });

// export const upload = multer({ storage });

// // Add new image
// export const uploadImage = async (req, res) => {
//   try {
//     const { title, category, uploaded_by } = req.body;
//     const imageFile = req.file;

//     if (!imageFile) {
//       return res.status(400).json({ error: "Image file is required" });
//     }

//     const imageUrl = `/uploads/gallery/${imageFile.filename}`;
//     const uploadedAt = new Date();

//     const [result] = await db.query(
//       `INSERT INTO gallery_images (title, image_url, category, uploaded_by, uploaded_at)
//        VALUES (?, ?, ?, ?, ?)`,
//       [title, imageUrl, category, uploaded_by || 1, uploadedAt]
//     );

//     res.status(201).json({
//       message: "Image uploaded successfully",
//       image_id: result.insertId,
//       image_url: imageUrl,
//     });
//   } catch (error) {
//     console.error("Upload Error:", error);
//     res.status(500).json({ error: "Failed to upload image" });
//   }
// };

// // Get all images
// export const getAllImages = async (req, res) => {
//   try {
//     const [rows] = await db.query("SELECT * FROM gallery_images ORDER BY uploaded_at DESC");
//     res.json(rows);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to fetch images" });
//   }
// };



import db from "../config/db.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads/gallery folder exists
const uploadDir = "uploads/gallery";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

export const upload = multer({ storage });

/* ===========================
   📤 Upload new image
=========================== */
export const uploadImage = async (req, res) => {
  try {
    const { title, category, uploaded_by } = req.body;
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const imageUrl = `/uploads/gallery/${imageFile.filename}`;
    const uploadedAt = new Date();

    const [result] = await db.query(
      `INSERT INTO gallery_images (title, image_url, category, uploaded_by, uploaded_at)
       VALUES (?, ?, ?, ?, ?)`,
      [title, imageUrl, category, uploaded_by || 1, uploadedAt]
    );

    res.status(201).json({
      message: "Image uploaded successfully",
      image_id: result.insertId,
      image_url: imageUrl,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
};

/* ===========================
   📸 Get all images
=========================== */
export const getAllImages = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM gallery_images ORDER BY uploaded_at DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Failed to fetch images" });
  }
};

/* ===========================
   ❌ Delete image
=========================== */
export const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Check if image exists
    const [rows] = await db.query("SELECT image_url FROM gallery_images WHERE image_id = ?", [id]);
    if (!rows.length) {
      return res.status(404).json({ error: "Image not found" });
    }

    const imagePath = `.${rows[0].image_url}`;

    // ✅ Delete from database
    await db.query("DELETE FROM gallery_images WHERE image_id = ?", [id]);

    // ✅ Try deleting file from server
    fs.unlink(imagePath, (err) => {
      if (err) console.warn("File not found or already deleted:", imagePath);
    });

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete image" });
  }
};
