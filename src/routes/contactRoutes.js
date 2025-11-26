import express from "express";
import mysql from "mysql2/promise";

const router = express.Router();

// ✅ Database connection
const db = await mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "", // change if needed
  database: "kiwenda_rehab",
});

// ✅ POST /contacts → Save contact form data
router.post("/", async (req, res) => {
  try {
    const { name, phone, email, message } = req.body;

    if (!name || !phone || !email || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    await db.execute(
      "INSERT INTO contacts (name, phone, email, message, status) VALUES (?, ?, ?, ?, ?)",
      [name, phone, email, message, "new"]
    );

    res.status(200).json({ message: "Message saved successfully!" });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ error: "Failed to save message." });
  }
});

// ✅ GET /contacts → Fetch all contact messages
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute(
  "SELECT contact_id AS id, name, phone, email, message, status, created_at FROM contacts ORDER BY contact_id DESC"
);

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ error: "Failed to fetch contacts." });
  }
});

// update message status
router.patch("/:id/read", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("UPDATE contacts SET status = 'Read' WHERE contact_id = ?", [id]);
    res.json({ success: true, message: "Message marked as read." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update message status." });
  }
});

// ✅  Get number of unread messages
router.get("/unread-count", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT COUNT(*) AS count FROM contacts WHERE status = 'new'"
    );
    res.json({ count: rows[0].count });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    res.status(500).json({ error: "Failed to fetch unread messages count." });
  }
});

// GET /contacts/archive
router.get("/contacts/archive", async (req, res) => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const archived = await db("contacts")
    .where("status", "Read")
    .andWhere("createdAt", "<", oneWeekAgo);

  res.json(archived);
});


// Auto archive cron-like behavior on fetch:
router.get("/contacts", async (req, res) => {
  const now = new Date();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(now.getDate() - 7);

  await db("contacts")
    .where("status", "Read")
    .andWhere("createdAt", "<", oneWeekAgo)
    .update({ status: "Archived" });

  const messages = await db("contacts")
    .whereNot("status", "Archived")
    .orderBy("createdAt", "desc");

  res.json(messages);
});




export default router;
