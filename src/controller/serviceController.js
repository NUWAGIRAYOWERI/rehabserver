// import pool from "../config/db.js";
// import path from "path";

// // ✅ Get all services
// export const getAllServices = async (req, res) => {
//   try {
//     const [rows] = await pool.query("SELECT * FROM services ORDER BY created_at DESC");

//     // Prepend full URL for image paths
//     const services = rows.map((service) => ({
//       ...service,
//       image_url: service.image_url
//         ? `${req.protocol}://${req.get("host")}/uploads/${service.image_url}`
//         : null,
//     }));

//     res.json(services);
//   } catch (err) {
//     console.error("Error fetching services:", err);
//     res.status(500).json({ message: "Failed to fetch services" });
//   }
// };

// // ✅ Get a single service by ID
// export const getServiceById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const [rows] = await pool.query("SELECT * FROM services WHERE service_id = ?", [id]);

//     if (rows.length === 0) {
//       return res.status(404).json({ message: "Service not found" });
//     }

//     const service = rows[0];

//     // Add full URL for image if exists
//     if (service.image_url) {
//       service.image_url = `${req.protocol}://${req.get("host")}/uploads/${service.image_url}`;
//     }

//     res.json(service);
//   } catch (err) {
//     console.error("Error fetching service by ID:", err);
//     res.status(500).json({ message: "Failed to fetch service" });
//   }
// };

// // ✅ Create a new service
// export const createService = async (req, res) => {
//   try {
//     const { name, description, long_description, status, category, icon } = req.body;
//     const image_filename = req.file ? req.file.filename : null;

//     if (!name || !description || !status || !category) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const [result] = await pool.query(
//       `INSERT INTO services 
//        (name, description, long_description, status, category, icon, image_url, created_at)
//        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
//       [name, description, long_description || "", status, category, icon || null, image_filename]
//     );

//     const image_url = image_filename
//       ? `${req.protocol}://${req.get("host")}/uploads/${image_filename}`
//       : null;

//     res.status(201).json({
//       message: "Service created successfully",
//       serviceId: result.insertId,
//       image_url,
//     });
//   } catch (err) {
//     console.error("Error creating service:", err);
//     res.status(500).json({ message: "Failed to create service" });
//   }
// };

// // ✅ Update existing service
// export const updateService = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, description, long_description, status, category, icon } = req.body;
//     const image_filename = req.file ? req.file.filename : null;

//     const query = image_filename
//       ? `UPDATE services 
//          SET name=?, description=?, long_description=?, status=?, category=?, icon=?, image_url=? 
//          WHERE service_id=?`
//       : `UPDATE services 
//          SET name=?, description=?, long_description=?, status=?, category=?, icon=? 
//          WHERE service_id=?`;

//     const params = image_filename
//       ? [name, description, long_description, status, category, icon, image_filename, id]
//       : [name, description, long_description, status, category, icon, id];

//     await pool.query(query, params);

//     const image_url = image_filename
//       ? `${req.protocol}://${req.get("host")}/uploads/${image_filename}`
//       : null;

//     res.json({
//       message: "Service updated successfully",
//       image_url,
//     });
//   } catch (err) {
//     console.error("Error updating service:", err);
//     res.status(500).json({ message: "Failed to update service" });
//   }
// };

// // ✅ Delete a service
// export const deleteService = async (req, res) => {
//   try {
//     const { id } = req.params;
//     await pool.query("DELETE FROM services WHERE service_id = ?", [id]);
//     res.json({ message: "Service deleted successfully" });
//   } catch (err) {
//     console.error("Error deleting service:", err);
//     res.status(500).json({ message: "Failed to delete service" });
//   }
// };



import pool from "../config/db.js";
import path from "path";

// ✅ Get all services
export const getAllServices = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM services ORDER BY created_at DESC");

    // Prepend full URL for image paths
    const services = rows.map((service) => ({
      ...service,
      image_url: service.image_url
        ? `${req.protocol}://${req.get("host")}/uploads/${service.image_url}`
        : null,
    }));

    res.json(services);
  } catch (err) {
    console.error("Error fetching services:", err);
    res.status(500).json({ message: "Failed to fetch services" });
  }
};

// ✅ Get a single service by ID
export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM services WHERE service_id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Service not found" });
    }

    const service = rows[0];

    if (service.image_url) {
      service.image_url = `${req.protocol}://${req.get("host")}/uploads/${service.image_url}`;
    }

    res.json(service);
  } catch (err) {
    console.error("Error fetching service by ID:", err);
    res.status(500).json({ message: "Failed to fetch service" });
  }
};

// ✅ Get a single service by slug
export const getServiceBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const [rows] = await pool.query("SELECT * FROM services WHERE slug = ?", [slug]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Service not found" });
    }

    const service = rows[0];

    if (service.image_url) {
      service.image_url = `${req.protocol}://${req.get("host")}/uploads/${service.image_url}`;
    }

    res.json(service);
  } catch (err) {
    console.error("Error fetching service by slug:", err);
    res.status(500).json({ message: "Failed to fetch service" });
  }
};

// ✅ Create a new service
export const createService = async (req, res) => {
  try {
    const { name, description, long_description, status, category, icon } = req.body;
    const image_filename = req.file ? req.file.filename : null;

    if (!name || !description || !status || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/\s+/g, "-");

    const [result] = await pool.query(
      `INSERT INTO services 
       (name, slug, description, long_description, status, category, icon, image_url, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [name, slug, description, long_description || "", status, category, icon || null, image_filename]
    );

    const image_url = image_filename
      ? `${req.protocol}://${req.get("host")}/uploads/${image_filename}`
      : null;

    res.status(201).json({
      message: "Service created successfully",
      serviceId: result.insertId,
      slug,
      image_url,
    });
  } catch (err) {
    console.error("Error creating service:", err);
    res.status(500).json({ message: "Failed to create service" });
  }
};

// ✅ Update existing service
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, long_description, status, category, icon } = req.body;
    const image_filename = req.file ? req.file.filename : null;

    // Update slug based on name
    const slug = name ? name.toLowerCase().replace(/\s+/g, "-") : null;

    const query = image_filename
      ? `UPDATE services 
         SET name=?, slug=?, description=?, long_description=?, status=?, category=?, icon=?, image_url=? 
         WHERE service_id=?`
      : `UPDATE services 
         SET name=?, slug=?, description=?, long_description=?, status=?, category=?, icon=? 
         WHERE service_id=?`;

    const params = image_filename
      ? [name, slug, description, long_description, status, category, icon, image_filename, id]
      : [name, slug, description, long_description, status, category, icon, id];

    await pool.query(query, params);

    const image_url = image_filename
      ? `${req.protocol}://${req.get("host")}/uploads/${image_filename}`
      : null;

    res.json({
      message: "Service updated successfully",
      slug,
      image_url,
    });
  } catch (err) {
    console.error("Error updating service:", err);
    res.status(500).json({ message: "Failed to update service" });
  }
};

// ✅ Delete a service
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM services WHERE service_id = ?", [id]);
    res.json({ message: "Service deleted successfully" });
  } catch (err) {
    console.error("Error deleting service:", err);
    res.status(500).json({ message: "Failed to delete service" });
  }
};
