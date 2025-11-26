import db from "../config/db.js";
import multer from "multer";

// Store file temporarily in memory (for DB insert)
const storage = multer.memoryStorage();
export const upload = multer({ storage });

// ✅ Upload new hero image
export const uploadHeroImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const imageBuffer = req.file.buffer;
    const description = req.body.description || "Hero background image";

    // Remove any old hero image (only one allowed)
    await db.query("DELETE FROM image_data");

    // Insert the new image as binary data (BLOB)
    await db.query(
      "INSERT INTO image_data (image, description) VALUES (?, ?)",
      [imageBuffer, description]
    );

    res.json({ success: true });
  } catch (error) {
    console.error("❌ Upload error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get the current hero image
export const getHeroImage = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM image_data LIMIT 1");

    if (rows.length === 0) {
      return res.json({});
    }

    const hero = rows[0];
    const base64Image = hero.image
      ? Buffer.from(hero.image).toString("base64")
      : null;

    res.json({
      image: base64Image,
      description: hero.description,
    });
  } catch (error) {
    console.error("❌ Fetch error:", error);
    res.status(500).json({ message: "Error fetching hero image" });
  }
};
