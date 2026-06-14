const passport = require("passport");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const JWT_SECRET = process.env.JWT_SECRET || "lumiere-secret-change-in-prod";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

console.log("✅ authRoutes loaded");
/* =========================================================
   REGISTER
   POST /api/auth/register
========================================================= */
router.post(
  "/register",
  [
    body("first_name").trim().notEmpty().withMessage("First name is required"),

    body("last_name").trim().notEmpty().withMessage("Last name is required"),

    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email required"),

    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),

    body("phone").optional().trim(),
  ],
  async (req, res) => {
    console.log("REGISTER BODY:", req.body);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { first_name, last_name, email, password, phone } = req.body;

    try {
      const [existing] = await db.query(
        "SELECT id FROM users WHERE email = ?",
        [email],
      );

      if (existing.length > 0) {
        return res.status(409).json({
          message: "An account with this email already exists.",
        });
      }

      /* const password_hash = await bcrypt.hash(password, 12);

      const [result] = await db.query(
        `
        INSERT INTO users
        (
          first_name,
          last_name,
          email,
          password_hash,
          phone
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [first_name, last_name, email, password_hash, phone || null],
      );*/
      const password_hash = await bcrypt.hash(password, 12);

      const [result] = await db.query(
        `
  INSERT INTO users
  (
    first_name,
    last_name,
    email,
    password_hash,
    phone,
    role
  )
  VALUES (?, ?, ?, ?, ?, ?)
  `,
        [
          first_name,
          last_name,
          email,
          password_hash,
          phone || null,
          "customer",
        ],
      );

      const userId = result.insertId;

      const token = jwt.sign(
        {
          id: userId,
          email,
          role: "customer",
        },
        JWT_SECRET,
        {
          expiresIn: JWT_EXPIRES_IN,
        },
      );

      res.status(201).json({
        message: "Account created successfully.",
        token,
        user: {
          id: userId,
          first_name,
          last_name,
          email,
          phone: phone || null,
          role: "customer",
        },
      });
    } catch (err) {
      console.error("Register error:", err);

      res.status(500).json({
        message: "Server error. Please try again.",
      });
    }
  },
);

/* =========================================================
   LOGIN
   POST /api/auth/login
========================================================= */
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email required"),

    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    console.log("LOGIN BODY:", req.body);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    try {
      const [rows] = await db.query(
        `
        SELECT
          id,
          first_name,
          last_name,
          email,
          password_hash,
          phone,
          role
        FROM users
        WHERE email = ?
        `,
        [email],
      );

      if (rows.length === 0) {
        return res.status(401).json({
          message: "Invalid email or password.",
        });
      }

      const user = rows[0];

      console.log("EMAIL:", email);
      console.log("USER FOUND:", user);
      console.log("PASSWORD:", password);
      console.log("HASH:", user.password_hash);
      console.log(await bcrypt.compare("Admin@123", user.password_hash));

      //const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!user.password_hash) {
        return res.status(401).json({
          message: "Please sign in with Google",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);

      console.log("MATCH:", isMatch);

      if (!isMatch) {
        return res.status(401).json({
          message: "Invalid email or password.",
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        JWT_SECRET,
        {
          expiresIn: JWT_EXPIRES_IN,
        },
      );

      return res.json({
        message: "Signed in successfully.",
        token,
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      });
    } catch (err) {
      console.error("Login error:", err);

      return res.status(500).json({
        message: "Server error. Please try again.",
      });
    }
  },
);
/* =========================================================
   PROFILE
   GET /api/auth/profile
========================================================= */
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query(
      `
        SELECT
          id,
          first_name,
          last_name,
          email,
          role,
          phone,
          address,
          city,
          country,
          profile_image,
          date_of_birth,
          email_verified,
          created_at
        FROM users
        WHERE id = ?
        `,
      [req.user.id],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    res.json({
      user: rows[0],
    });
  } catch (err) {
    console.error("Profile error:", err);

    res.status(500).json({
      message: "Server error.",
    });
  }
});

/* =========================================================
   LOGOUT
   POST /api/auth/logout
========================================================= */
router.post("/logout", (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully",
  });
});
//google
console.log("GOOGLE ROUTES LOADED");
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
  }),
  (req, res) => {
    const token = jwt.sign(
      {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
      },
    );

    res.redirect(`http://localhost:5173/login-success?token=${token}`);
  },
);
//testing
router.get("/hello", (req, res) => {
  res.send("Auth route working");
});
module.exports = router;
