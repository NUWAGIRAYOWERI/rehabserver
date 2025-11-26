import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import pageRoutes from "./routes/pageRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import heroRoutes from "./routes/heroRoutes.js";
import upcomingAppointmentsRoutes from "./routes/upcomingAppointmentsRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

const app = express();

// ✅ Resolve directory path for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Middleware: CORS with multiple origins
const allowedOrigins = ["http://localhost:3000", "http://localhost:9002"];
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g., Postman, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ Middleware: Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve static uploaded images
app.use("/uploads", express.static(path.join(__dirname, "../..", "uploads")));

// ✅ API Routes
app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);
app.use("/services", serviceRoutes);
app.use("/pages", pageRoutes);
app.use("/gallery", galleryRoutes);
app.use("/testimonials", testimonialRoutes);
app.use("/contacts", contactRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/hero", heroRoutes);
app.use("/upcoming-appointments", upcomingAppointmentsRoutes);
app.use("/analytics", analyticsRoutes);

// ✅ Root route for quick health check
app.get("/", (req, res) => {
  res.send("🚀 Kiwenda Backend API is running...");
});

export default app;
