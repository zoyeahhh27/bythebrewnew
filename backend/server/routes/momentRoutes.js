const express = require("express");
const Moment = require("../models/Moment");

const router = express.Router();

// Add a new moment
router.post("/", async (req, res) => {
  try {
    const { title, name, image } = req.body;

    if (!title || !image) {
      return res.status(400).json({
        message: "Title and image are required",
      });
    }

    const moment = new Moment({
      title,
      name: name || "A Brew Lover",
      image,
    });

    const savedMoment = await moment.save();

    res.status(201).json({
      message: "Moment added successfully",
      moment: savedMoment,
    });
  } catch (error) {
    console.error("Error adding moment:", error);

    res.status(500).json({
      message: "Failed to add moment",
      error: error.message,
    });
  }
});

// Get latest 5 moments
router.get("/", async (req, res) => {
  try {
    const moments = await Moment.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json(moments);
  } catch (error) {
    console.error("Error fetching moments:", error);

    res.status(500).json({
      message: "Failed to fetch moments",
      error: error.message,
    });
  }
});



module.exports = router;