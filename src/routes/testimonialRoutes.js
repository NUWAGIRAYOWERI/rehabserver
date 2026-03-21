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
  updateTestimonial,
} from "../controller/testimonialController.js";

const router = express.Router();

// Routes
router.get("/", getTestimonials);
router.post("/add", upload.single("photo"), addTestimonial);
router.put("/:id", upload.single("photo"), updateTestimonial);
router.delete("/:id", deleteTestimonial);

export default router;
