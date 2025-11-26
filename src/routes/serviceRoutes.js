// import express from "express";
// import multer from "multer";
// import path from "path";
// import {
//   getAllServices,
//   getServiceById,
//   createService,
//   updateService,
//   deleteService,
// } from "../controller/serviceController.js";

// const router = express.Router();

// // ✅ Configure multer for disk storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // make sure you have this folder at your project root
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage });

// // ✅ Routes
// router.get("/", getAllServices);          // Fetch all services
// router.get("/:id", getServiceById);       // Fetch single service by ID
// router.post("/", upload.single("image"), createService);  // Create service
// router.put("/:id", upload.single("image"), updateService); // Update service
// router.delete("/:id", deleteService);     // Delete service

// export default router;


// import express from "express";
// import multer from "multer";
// import path from "path";
// import {
//   getAllServices,
//   getServiceById,
//   getServiceBySlug, // ✅ new import
//   createService,
//   updateService,
//   deleteService,
// } from "../controller/serviceController.js";

// const router = express.Router();

// // ✅ Configure multer for disk storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // make sure this folder exists at your project root
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage });

// /* ✅ ROUTES */

// // Fetch all services
// router.get("/", getAllServices);

// // Fetch a single service by slug (IMPORTANT: must come before /:id)
// router.get("/slug/:slug", getServiceBySlug); // ✅ New endpoint

// // Fetch a single service by ID
// router.get("/:id", getServiceById);

// // Create new service
// router.post("/", upload.single("image"), createService);

// // Update existing service
// router.put("/:id", upload.single("image"), updateService);

// // Delete service
// router.delete("/:id", deleteService);

// export default router;



import express from "express";
import multer from "multer";
import path from "path";
import {
  getAllServices,
  getServiceById,
  getServiceBySlug,
  createService,
  updateService,
  deleteService,
} from "../controller/serviceController.js";

const router = express.Router();

// ✅ Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // ensure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* ✅ ROUTES */

// Get all services
router.get("/", getAllServices);

// Get a single service by slug (must come before :id)
router.get("/slug/:slug", getServiceBySlug);

// Get a single service by ID
router.get("/:id", getServiceById);

// Create a new service
router.post("/", upload.single("image"), createService);

// Update an existing service
router.put("/:id", upload.single("image"), updateService);

// Delete a service
router.delete("/:id", deleteService);

export default router;
