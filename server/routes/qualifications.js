const express = require("express");
const { body, validationResult } = require("express-validator");
const Qualification = require("../models/Qualification");
const auth = require("../middleware/auth");

const router = express.Router();

// Get all qualifications
router.get("/", async (req, res) => {
  try {
    const { search, category, page = 1, limit = 20 } = req.query;
    const query = {};

    if (search) {
      query.$text = { $search: search };
    }
    if (category) {
      query.category = category;
    }

    const qualifications = await Qualification.find(query)
      .populate("createdBy", "username")
      .sort({ isOfficial: -1, name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Qualification.countDocuments(query);

    res.json({
      qualifications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Error fetching qualifications:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get qualification categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Qualification.distinct("category");
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create new qualification
router.post(
  "/",
  auth,
  [
    body("name").notEmpty().trim().isLength({ max: 200 }),
    body("category").isIn(["IT", "Business", "Language", "Finance", "Medical", "Legal", "Engineering", "Other"]),
    body("difficulty").optional().isIn(["Beginner", "Intermediate", "Advanced", "Expert"]),
    body("description").optional().isLength({ max: 500 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const qualification = new Qualification({
        ...req.body,
        createdBy: req.user._id,
      });

      await qualification.save();
      await qualification.populate("createdBy", "username");

      res.status(201).json(qualification);
    } catch (error) {
      console.error("Error creating qualification:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;