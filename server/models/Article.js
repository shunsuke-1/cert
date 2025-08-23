const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    excerpt: {
      type: String,
      maxlength: 300,
    },
    tags: [String],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create text index for search functionality
articleSchema.index({ title: "text", content: "text", tags: "text" });

// Generate excerpt from content if not provided
articleSchema.pre("save", function (next) {
  if (!this.excerpt && this.content) {
    // Remove HTML tags and get first 200 characters
    const plainText = this.content.replace(/<[^>]*>/g, "");
    this.excerpt =
      plainText.substring(0, 200) + (plainText.length > 200 ? "..." : "");
  }
  next();
});

module.exports = mongoose.model("Article", articleSchema);
