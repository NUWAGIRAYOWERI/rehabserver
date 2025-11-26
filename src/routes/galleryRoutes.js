// import express from "express";
// import { upload, uploadImage, getAllImages } from "../controller/galleryController.js";

// const router = express.Router();

// router.post("/upload", upload.single("image"), uploadImage);
// router.get("/", getAllImages);

// export default router;



import express from "express";
import {
  upload,
  uploadImage,
  getAllImages,
  deleteImage
} from "../controller/galleryController.js";

const router = express.Router();

// ✅ Upload new image
router.post("/upload", upload.single("image"), uploadImage);

// ✅ Get all images
router.get("/", getAllImages);

// ✅ Delete an image by ID
router.delete("/:id", deleteImage);

export default router;
