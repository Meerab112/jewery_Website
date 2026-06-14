require("dotenv").config();
console.log("CLIENT ID:", process.env.GOOGLE_CLIENT_ID);
console.log("CLIENT SECRET:", process.env.GOOGLE_CLIENT_SECRET);
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");
const db = require("./config/db");
require("dotenv").config();
const path = require("path");
const productRoutes = require("./routes/productRoutes");
const brandRoutes = require("./routes/brandRoutes");
const cartRoutes = require("./routes/cartRoutes");
const authRoutes = require("./routes/authRoutes");
console.log("AUTH ROUTES OBJECT:", authRoutes);
const orderRoutes = require("./routes/orderRoutes");
//const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  "/images",
  express.static(path.join(__dirname, "../jewelry-website/public/images")),
);
// ✅ DEBUG LOG (IMPORTANT)
app.use((req, res, next) => {
  console.log("➡️ Request:", req.method, req.url);
  next();
});
app.get("/test", (req, res) => {
  res.json({ ok: true });
});
app.post("/debug", (req, res) => {
  console.log("DEBUG BODY:", req.body);
  res.json({
    received: req.body,
  });
});
//
app.use(
  session({
    secret: "google-login-secret",
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const [rows] = await db.query("SELECT * FROM users WHERE id=?", [id]);
  done(null, rows[0]);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        const [users] = await db.query("SELECT * FROM users WHERE email=?", [
          email,
        ]);

        let user;

        if (users.length === 0) {
          const [result] = await db.query(
            `
            INSERT INTO users
            (
              first_name,
              last_name,
              email,
              google_id,
              role
            )
            VALUES (?,?, ?, ?, ?)
            `,
            [
              profile.name.givenName || "Google",
              profile.name.familyName || "User",
              email,
              profile.id,
              "customer",
            ],
          );

          user = {
            id: result.insertId,
            email,
            role: "customer",
          };
        } else {
          await db.query("UPDATE users SET google_id=? WHERE id=?", [
            profile.id,
            users[0].id,
          ]);

          user = users[0];
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    },
  ),
);

// ✅ ROUTES
app.use("/api/products", productRoutes);
app.use("/api/brand-content", brandRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
//app.use("/api/admin", adminRoutes);

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// ❌ ADD THIS (IMPORTANT DEBUG FOR 404s)
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
