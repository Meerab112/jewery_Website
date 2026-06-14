const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

function generateOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `LUM-${timestamp}-${random}`;
}

/* ============================================================
   POST /api/orders/create
============================================================ */
router.post("/create", authMiddleware, async (req, res) => {
  let conn;
  try {
    conn = await db.getConnection();
    await conn.beginTransaction();

    const {
      cartItems = [],
      shippingInfo = {},
      paymentMethod,
      paymentDetails = {},
    } = req.body;

    const userId = req.user.id;

    console.log("ORDER REQUEST - userId:", userId);
    console.log("ORDER REQUEST - cartItems:", cartItems);
    console.log("ORDER REQUEST - paymentMethod:", paymentMethod);

    if (!cartItems.length) {
      await conn.rollback();
      conn.release();
      return res.status(400).json({ message: "Cart is empty." });
    }

    // TOTALS (calculated server-side)
    const subtotal = cartItems.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0,
    );
    const shipping = subtotal >= 500 ? 0 : 15;
    const tax = subtotal * 0.08;
    const grand_total = subtotal + shipping + tax;

    // PAYMENT STATUS
    let paymentStatus = "pending";
    if (paymentMethod === "card") {
      const { cardNumber, cardHolder, expiry, cvv } = paymentDetails;
      if (!cardNumber || !cardHolder || !expiry || !cvv) {
        await conn.rollback();
        conn.release();
        return res.status(400).json({ message: "Card details missing." });
      }
      paymentStatus = "paid";
    }

    if (paymentMethod !== "card" && paymentMethod !== "cod") {
      await conn.rollback();
      conn.release();
      return res.status(400).json({ message: "Invalid payment method." });
    }

    // CREATE ORDER
    const orderNumber = generateOrderNumber();
    console.log("Creating order:", orderNumber);

    const [orderResult] = await conn.query(
      `INSERT INTO orders
        (order_number, user_id, subtotal, shipping, tax, grand_total,
         payment_method, payment_status, order_status,
         shipping_first_name, shipping_last_name, shipping_email,
         shipping_phone, shipping_country, shipping_city,
         shipping_address, shipping_postal_code)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderNumber,
        userId,
        subtotal,
        shipping,
        tax,
        grand_total,
        paymentMethod,
        paymentStatus,
        "pending",
        shippingInfo.firstName || "",
        shippingInfo.lastName || "",
        shippingInfo.email || "",
        shippingInfo.phone || "",
        shippingInfo.country || "",
        shippingInfo.city || "",
        shippingInfo.address || "",
        shippingInfo.postalCode || "",
      ],
    );

    const orderId = orderResult.insertId;
    console.log("Order inserted, id:", orderId);

    // INSERT ORDER ITEMS
    for (const item of cartItems) {
      await conn.query(
        `INSERT INTO order_items
          (order_id, product_id, product_name, product_img,
           quantity, unit_price, subtotal)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          item.productId,
          item.name || "",
          item.img_url || "",
          item.quantity,
          Number(item.price),
          Number(item.price) * Number(item.quantity),
        ],
      );
    }
    console.log("Order items inserted");

    // INSERT PAYMENT RECORD
    const transactionId =
      paymentMethod === "card" ? `TXN-${Date.now()}` : `COD-${Date.now()}`;

    const cardLast4 =
      paymentMethod === "card" && paymentDetails?.cardNumber
        ? paymentDetails.cardNumber.replace(/\s/g, "").slice(-4)
        : "";

    const cardHolder =
      paymentMethod === "card" && paymentDetails?.cardHolder
        ? paymentDetails.cardHolder
        : "Cash On Delivery";

    await conn.query(
      `INSERT INTO payments
        (order_id, payment_method, payment_status, amount,
         card_last4, card_holder, transaction_id, payment_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        orderId,
        paymentMethod,
        paymentStatus,
        grand_total,
        cardLast4,
        cardHolder,
        transactionId,
      ],
    );
    console.log("Payment record inserted");

    // CLEAR CART
    await conn.query(`DELETE FROM cart WHERE user_id = ?`, [userId]);
    console.log("Cart cleared");

    await conn.commit();
    conn.release();

    console.log("Order complete:", orderNumber);

    return res.status(201).json({
      success: true,
      orderId,
      orderNumber,
      paymentStatus,
      grandTotal: grand_total,
    });
  } catch (err) {
    if (conn) {
      try {
        await conn.rollback();
      } catch {}
      try {
        conn.release();
      } catch {}
    }
    console.error("\n===== ORDER ERROR =====");
    console.error("MESSAGE :", err.message);
    console.error("SQL MSG :", err.sqlMessage);
    console.error("SQL     :", err.sql);
    console.error("CODE    :", err.code);
    console.error("=======================\n");

    return res.status(500).json({
      message: err.sqlMessage || err.message || "Server error",
      code: err.code,
    });
  }
});

/* ============================================================
   GET /api/orders/by-number/:orderNumber
============================================================ */
router.get("/by-number/:orderNumber", authMiddleware, async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT * FROM orders WHERE order_number = ? AND user_id = ?`,
      [req.params.orderNumber, req.user.id],
    );

    if (!orders.length)
      return res.status(404).json({ message: "Order not found." });

    const [items] = await db.query(
      `SELECT * FROM order_items WHERE order_id = ?`,
      [orders[0].id],
    );

    res.json({ order: orders[0], items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ============================================================
   GET /api/orders/:orderId
============================================================ */
router.get("/:orderId", authMiddleware, async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT * FROM orders WHERE id = ? AND user_id = ?`,
      [req.params.orderId, req.user.id],
    );

    if (!orders.length)
      return res.status(404).json({ message: "Order not found." });

    const [items] = await db.query(
      `SELECT * FROM order_items WHERE order_id = ?`,
      [orders[0].id],
    );

    res.json({ order: orders[0], items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
