// const mongoose = require('mongoose');

// const articleSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//     trim: true,
//     maxlength: 200
//   },
//   content: {
//     type: String,
//     required: true
//   },
//   author: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   excerpt: {
//     type: String,
//     maxlength: 300
//   },
//   tags: [String],
//   likes: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   }],
//   views: {
//     type: Number,
//     default: 0
//   },
//   isPublished: {
//     type: Boolean,
//     default: true
//   }
// }, {
//   timestamps: true
// });

// // Create text index for search functionality
// articleSchema.index({ title: 'text', content: 'text', tags: 'text' });

// // Generate excerpt from content if not provided
// articleSchema.pre('save', function(next) {
//   if (!this.excerpt && this.content) {
//     // Remove HTML tags and get first 200 characters
//     const plainText = this.content.replace(/<[^>]*>/g, '');
//     this.excerpt = plainText.substring(0, 200) + (plainText.length > 200 ? '...' : '');
//   }
//   next();
// });

// module.exports = mongoose.model('Article', articleSchema);

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
