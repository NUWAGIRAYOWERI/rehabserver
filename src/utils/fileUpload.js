// src/utils/fileUpload.js
import multer from "multer";
import path from "path";

// Set storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // save to uploads folder
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`
    );
  },
});

// File filter (only images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });
export default upload;
