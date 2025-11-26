// src/routes/authRoutes.js
import express from "express";
// import authController from "../controller/authController.js";
import { loginAdmin } from "../controller/authController.js";

const router = express.Router();

// POST /auth/login
// router.post("/login", authController.login);
router.post("/login", loginAdmin);

export default router;
