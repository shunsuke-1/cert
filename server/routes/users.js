const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// Get user statistics
router.get("/stats/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // Get article count and total likes
    const Article = require("../models/Article");
    const articles = await Article.find({ author: userId });
    const articleCount = articles.length;
    const totalLikes = articles.reduce(
      (sum, article) => sum + (article.likes?.length || 0),
      0
    );

    res.json({
      articleCount,
      totalLikes,
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user profile
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update user profile
router.put(
  "/profile",
  auth,
  [
    body("profile.bio").optional().trim(),
    body("profile.studyGoals").optional().isArray(),
    body("profile.certifications").optional().isArray(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: { profile: req.body.profile } },
        { new: true }
      ).select("-password");

      res.json(user);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// POST /api/users/:id/follow : ユーザーのフォロー／アンフォロー
router.post("/:id/follow", auth, async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id;

    if (targetUserId === String(currentUserId)) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      // アンフォロー
      currentUser.following = currentUser.following.filter(
        (id) => String(id) !== targetUserId
      );
      targetUser.followers = targetUser.followers.filter(
        (id) => String(id) !== String(currentUserId)
      );
      await currentUser.save();
      await targetUser.save();
      return res.json({
        message: "Unfollowed",
        followersCount: targetUser.followers.length,
        followingCount: currentUser.following.length,
      });
    } else {
      // フォロー
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);
      await currentUser.save();
      await targetUser.save();
      return res.json({
        message: "Followed",
        followersCount: targetUser.followers.length,
        followingCount: currentUser.following.length,
      });
    }
  } catch (error) {
    console.error("Error following user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add certification
router.post(
  "/certifications",
  auth,
  [
    body("name").notEmpty().trim(),
    body("status").isIn(["studying", "passed", "planning"]),
  ],
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      user.profile.certifications.push(req.body);
      await user.save();

      res.json(user.profile.certifications);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
