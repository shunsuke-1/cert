const express = require("express");
const { body, validationResult } = require("express-validator");
const Article = require("../models/Article");
const auth = require("../middleware/auth");

const router = express.Router();

// Get user's own articles
router.get("/my-articles", auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const query = { author: req.user._id };

    const articles = await Article.find(query)
      .populate("author", "username")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Article.countDocuments(query);

    res.json({
      articles,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Error fetching user articles:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all articles with pagination and search
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, search, sortBy = "createdAt" } = req.query;
    const query = { isPublished: true };

    // Add search functionality
    if (search) {
      query.$text = { $search: search };
    }

    const sortOptions = {};
    if (search) {
      sortOptions.score = { $meta: "textScore" };
    } else {
      sortOptions[sortBy] = -1;
    }

    const articles = await Article.find(query)
      .populate("author", "username")
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select("-content"); // Exclude full content, only show excerpt

    const total = await Article.countDocuments(query);

    res.json({
      articles,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 既存の `/api/articles` ルート群に追加
router.get("/user/:id", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.params.id;
    const query = { author: userId };

    const articles = await Article.find(query)
      .populate("author", "username")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Article.countDocuments(query);

    res.json({
      articles,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching articles by user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single article by ID
router.get("/:id", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate(
      "author",
      "username"
    );

    if (!article || !article.isPublished) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Increment view count
    article.views += 1;
    await article.save();

    res.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create new article
router.post(
  "/",
  auth,
  [
    body("title").notEmpty().trim().isLength({ max: 200 }),
    body("content").notEmpty(),
    body("tags").optional().isArray(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const article = new Article({
        ...req.body,
        author: req.user._id,
      });

      await article.save();
      await article.populate("author", "username");

      res.status(201).json(article);
    } catch (error) {
      console.error("Error creating article:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Update article
router.put(
  "/:id",
  auth,
  [
    body("title").optional().trim().isLength({ max: 200 }),
    body("content").optional(),
    body("tags").optional().isArray(),
  ],
  async (req, res) => {
    try {
      const article = await Article.findById(req.params.id);

      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }

      // Check if user is the author
      if (article.author.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: "Not authorized to edit this article" });
      }

      Object.assign(article, req.body);
      await article.save();
      await article.populate("author", "username");

      res.json(article);
    } catch (error) {
      console.error("Error updating article:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Delete article
router.delete("/:id", auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Check if user is the author
    if (article.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this article" });
    }

    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Like/unlike article
router.post("/:id/like", auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    const likeIndex = article.likes.indexOf(req.user._id);
    if (likeIndex > -1) {
      article.likes.splice(likeIndex, 1);
    } else {
      article.likes.push(req.user._id);
    }

    await article.save();
    res.json({ likes: article.likes.length, isLiked: likeIndex === -1 });
  } catch (error) {
    console.error("Error liking article:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
