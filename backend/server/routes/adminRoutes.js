const express = require("express");
const crypto = require("crypto");

const router = express.Router();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_SECRET = process.env.ADMIN_SECRET;

const activeTokens = new Set();

if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !ADMIN_SECRET) {
  console.warn(
    "Warning: ADMIN_USERNAME, ADMIN_PASSWORD or ADMIN_SECRET is missing from .env"
  );
}

// ADMIN LOGIN
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required",
    });
  }

  if (
    username !== ADMIN_USERNAME ||
    password !== ADMIN_PASSWORD
  ) {
    return res.status(401).json({
      message: "Invalid username or password",
    });
  }

  const token = crypto
    .createHmac("sha256", ADMIN_SECRET)
    .update(
      `${username}:${Date.now()}:${crypto
        .randomBytes(16)
        .toString("hex")}`
    )
    .digest("hex");

  activeTokens.add(token);

  res.json({
    message: "Admin login successful",
    token,
  });
});

// ADMIN LOGOUT
router.post("/logout", (req, res) => {
  const authHeader = req.headers.authorization || "";

  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    activeTokens.delete(token);
  }

  res.json({
    message: "Logged out successfully",
  });
});

// ADMIN AUTHENTICATION MIDDLEWARE
const requireAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Admin authentication required",
    });
  }

  const token = authHeader.slice(7);

  if (!activeTokens.has(token)) {
    return res.status(401).json({
      message: "Invalid or expired admin session",
    });
  }

  next();
};

router.requireAdmin = requireAdmin;

module.exports = router;