import db from "../config/db.js";

async function testConnection() {
  try {
    const [rows] = await db.query("SELECT NOW() AS currentTime;");
    console.log("✅ Database connected successfully at:", rows[0].currentTime);
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
}

testConnection();
