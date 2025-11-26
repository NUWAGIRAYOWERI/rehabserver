import express from "express";
import dotenv from "dotenv";
import app from "./src/app.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// ✅ Define project root (for serving static uploads)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
