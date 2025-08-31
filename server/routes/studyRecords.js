const express = require("express");
const { body, validationResult } = require("express-validator");
const StudyRecord = require("../models/StudyRecord");
const UserQualification = require("../models/UserQualification");
const auth = require("../middleware/auth");

const router = express.Router();

// Get study timeline (public records from all users)
router.get("/timeline", async (req, res) => {
  try {
    const { page = 1, limit = 20, qualification } = req.query;
    const query = { isPublic: true };

    if (qualification) {
      query.qualification = qualification;
    }

    const records = await StudyRecord.find(query)
      .populate("user", "username")
      .populate("qualification", "name category")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await StudyRecord.countDocuments(query);

    res.json({
      records,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Error fetching study timeline:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user's study records
router.get("/my-records", auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, qualification } = req.query;
    const query = { user: req.user._id };

    if (qualification) {
      query.qualification = qualification;
    }

    const records = await StudyRecord.find(query)
      .populate("qualification", "name category")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await StudyRecord.countDocuments(query);

    res.json({
      records,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Error fetching user records:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user's qualifications
router.get("/my-qualifications", auth, async (req, res) => {
  try {
    const qualifications = await UserQualification.find({ user: req.user._id })
      .populate("qualification", "name category difficulty")
      .sort({ createdAt: -1 });

    res.json(qualifications);
  } catch (error) {
    console.error("Error fetching user qualifications:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add qualification to user's study list
router.post("/add-qualification", auth, async (req, res) => {
  try {
    const { qualificationId, status = "studying", targetDate, notes } = req.body;

    // Check if already exists
    const existing = await UserQualification.findOne({
      user: req.user._id,
      qualification: qualificationId,
    });

    if (existing) {
      return res.status(400).json({ message: "Qualification already added" });
    }

    const userQualification = new UserQualification({
      user: req.user._id,
      qualification: qualificationId,
      status,
      targetDate,
      notes,
    });

    await userQualification.save();
    await userQualification.populate("qualification", "name category difficulty");

    res.status(201).json(userQualification);
  } catch (error) {
    console.error("Error adding qualification:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create study record
router.post(
  "/",
  auth,
  [
    body("qualification").notEmpty(),
    body("title").notEmpty().trim().isLength({ max: 200 }),
    body("content").notEmpty(),
    body("studyHours").optional().isFloat({ min: 0, max: 24 }),
    body("mood").optional().isIn(["😊", "😐", "😔", "🔥", "😴"]),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const record = new StudyRecord({
        ...req.body,
        user: req.user._id,
      });

      await record.save();
      await record.populate([
        { path: "user", select: "username" },
        { path: "qualification", select: "name category" },
      ]);

      res.status(201).json(record);
    } catch (error) {
      console.error("Error creating study record:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Like/unlike study record
router.post("/:id/like", auth, async (req, res) => {
  try {
    const record = await StudyRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: "Study record not found" });
    }

    const likeIndex = record.likes.indexOf(req.user._id);
    if (likeIndex > -1) {
      record.likes.splice(likeIndex, 1);
    } else {
      record.likes.push(req.user._id);
    }

    await record.save();
    res.json({ likes: record.likes.length, isLiked: likeIndex === -1 });
  } catch (error) {
    console.error("Error liking study record:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add comment to study record
router.post("/:id/comment", auth, [
  body("content").notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const record = await StudyRecord.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: "Study record not found" });
    }

    record.comments.push({
      user: req.user._id,
      content: req.body.content,
    });

    await record.save();
    await record.populate("comments.user", "username");

    res.json(record.comments[record.comments.length - 1]);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;