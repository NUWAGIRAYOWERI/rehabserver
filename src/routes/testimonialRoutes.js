// import express from "express";
// import multer from "multer";
// import {
//   getTestimonials,
//   addTestimonial,
//   deleteTestimonial,
// } from "../controller/testimonialController.js";

// const router = express.Router();

// // file uploads
// const upload = multer({ dest: "uploads/" });

// router.get("/", getTestimonials);
// router.post("/add", upload.single("photo"), addTestimonial);
// router.delete("/:id", deleteTestimonial);

// export default router;

import express from "express";
import {
  upload,
  getTestimonials,
  addTestimonial,
  deleteTestimonial,
} from "../controller/testimonialController.js";

const router = express.Router();

// ✅ Get all testimonials
router.get("/", getTestimonials);

// ✅ Add testimonial WITH image upload
router.post("/add", upload.single("photo"), addTestimonial);

// ✅ Delete testimonial
router.delete("/:id", deleteTestimonial);

export default router;
