const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const orderRoutes = require("./routes/orderRoutes");
const momentRoutes = require("./routes/momentRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Admin authentication
app.use("/api/admin", adminRoutes);

// Existing routes
app.use("/api/orders", orderRoutes);
app.use("/api/moments", momentRoutes);

const PORT = process.env.PORT || 5001;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(
        `By The Brew API running on http://localhost:${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error(
      "MongoDB connection failed:",
      error.message
    );
  });

app.get("/", (req, res) => {
  res.json({
    message: "By The Brew backend is running ☕",
  });
});