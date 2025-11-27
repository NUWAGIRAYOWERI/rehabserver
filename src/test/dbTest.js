// testDb.js
import pool from "../config/db.js"; // ✅ use the serverless-safe pool

async function testConnection() {
  try {
    // Execute a simple query
    const [rows] = await pool.query("SELECT NOW() AS currentTime;");
    console.log("✅ Database connected successfully at:", rows[0].currentTime);
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  } finally {
    // Optional: close all pool connections if testing locally
    await pool.end();
  }
}

// Run the test
testConnection();
