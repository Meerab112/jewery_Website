const db = require("../config/db");

/* ==========================================
   GET ALL PRODUCTS
========================================== */
exports.getProducts = async (req, res) => {
  const { category, type, section, name } = req.query;

  let sql = "SELECT * FROM jewelry_products WHERE 1=1";
  const values = [];

  if (category) {
    sql += " AND category = ?";
    values.push(category);
  }

  if (type) {
    sql += " AND type = ?";
    values.push(type);
  }

  if (section) {
    sql += " AND section = ?";
    values.push(section);
  }

  if (name) {
    sql += " AND name LIKE ?";
    values.push(`%${name}%`);
  }

  try {
    const [products] = await db.query(sql, values);

    res.json(products);
  } catch (err) {
    console.error("Get Products Error:", err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

/* ==========================================
   GET PRODUCT BY ID
========================================== */
exports.getProductById = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM jewelry_products WHERE id = ?",
      [req.params.id],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Get Product Error:", err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

/* ==========================================
   ADD PRODUCT (ADMIN ONLY)
========================================== */
exports.addProduct = async (req, res) => {
  const { name, price, category, img, material } = req.body;

  try {
    const [result] = await db.query(
      `
      INSERT INTO jewelry_products
      (
        name,
        price,
        category,
        img_url,
        material
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [name, price, category, img, material],
    );

    res.status(201).json({
      message: "Product added successfully",
      productId: result.insertId,
    });
  } catch (err) {
    console.error("Add Product Error:", err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

/* ==========================================
   UPDATE PRODUCT (ADMIN ONLY)
========================================== */
exports.updateProduct = async (req, res) => {
  const { name, price, category, img, material } = req.body;

  try {
    const [result] = await db.query(
      `
      UPDATE jewelry_products
      SET
        name = ?,
        price = ?,
        category = ?,
        img_url = ?,
        material = ?
      WHERE id = ?
      `,
      [name, price, category, img, material, req.params.id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product updated successfully",
    });
  } catch (err) {
    console.error("Update Product Error:", err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

/* ==========================================
   DELETE PRODUCT (ADMIN ONLY)
========================================== */
exports.deleteProduct = async (req, res) => {
  try {
    const [result] = await db.query(
      "DELETE FROM jewelry_products WHERE id = ?",
      [req.params.id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product deleted successfully",
    });
  } catch (err) {
    console.error("Delete Product Error:", err);

    res.status(500).json({
      message: "Server error",
    });
  }
};
