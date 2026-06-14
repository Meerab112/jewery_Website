/*const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ADD TO CART
router.post("/add", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const [existing] = await db.query(
      "SELECT * FROM cart WHERE user_id = ? AND product_id = ?",
      [userId, productId],
    );
    if (existing.length > 0) {
      await db.query(
        "UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?",
        [quantity || 1, userId, productId],
      );
    } else {
      await db.query(
        "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
        [userId, productId, quantity || 1],
      );
    }
    res.json({ success: true, message: "Added to cart" });
  } catch (err) {
    res.status(500).json({ error: err.message, code: err.code });
  }
});

// UPDATE QUANTITY
router.put("/update", async (req, res) => {
  try {
    const { cartId, quantity } = req.body;
    if (quantity < 1)
      return res.status(400).json({ error: "Quantity must be at least 1" });
    await db.query("UPDATE cart SET quantity = ? WHERE id = ?", [
      quantity,
      cartId,
    ]);
    res.json({ success: true, message: "Quantity updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// REMOVE ITEM
router.delete("/remove/:cartId", async (req, res) => {
  try {
    const { cartId } = req.params;
    await db.query("DELETE FROM cart WHERE id = ?", [cartId]);
    res.json({ success: true, message: "Item removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET CART ITEMS — must be last since /:userId is a wildcard
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const [items] = await db.query(
      `SELECT 
        c.id AS cartId,
        c.quantity,
        p.id AS productId,
        p.name,
        p.price,
        p.img_url,
        p.category
      FROM cart c
      JOIN jewelry_products p ON c.product_id = p.id
      WHERE c.user_id = ?`,
      [userId],
    );
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message, code: err.code });
  }
});

module.exports = router;
*/
const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ADD TO CART — atomic upsert, no duplicate rows
router.post("/add", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    await db.query(
      `INSERT INTO cart (user_id, product_id, quantity)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
      [userId, productId, quantity || 1],
    );
    res.json({ success: true, message: "Added to cart" });
  } catch (err) {
    res.status(500).json({ error: err.message, code: err.code });
  }
});

// UPDATE QUANTITY
router.put("/update", async (req, res) => {
  try {
    const { cartId, quantity } = req.body;
    if (quantity < 1)
      return res.status(400).json({ error: "Quantity must be at least 1" });
    await db.query("UPDATE cart SET quantity = ? WHERE id = ?", [
      quantity,
      cartId,
    ]);
    res.json({ success: true, message: "Quantity updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// REMOVE ITEM
router.delete("/remove/:cartId", async (req, res) => {
  try {
    const { cartId } = req.params;
    await db.query("DELETE FROM cart WHERE id = ?", [cartId]);
    res.json({ success: true, message: "Item removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CLEAR CART (called after order placed)
router.delete("/clear/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    await db.query("DELETE FROM cart WHERE user_id = ?", [userId]);
    res.json({ success: true, message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET CART ITEMS
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const [items] = await db.query(
      `SELECT 
        c.id AS cartId,
        c.quantity,
        p.id AS productId,
        p.name,
        p.price,
        p.img_url,
        p.category
      FROM cart c
      JOIN jewelry_products p ON c.product_id = p.id
      WHERE c.user_id = ?`,
      [userId],
    );
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message, code: err.code });
  }
});

module.exports = router;
