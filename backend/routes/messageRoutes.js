const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const { protect } = require("../middleware/authMiddleware");

router.get("/:roomId", protect, async (req, res) => {
  try {
    if (!req.params.roomId?.trim()) {
      return res.status(400).json({ message: "Room id is required" });
    }

    const messages = await Message.find({ room: req.params.roomId })
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
