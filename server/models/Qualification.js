const mongoose = require("mongoose");

const qualificationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["IT", "Business", "Language", "Finance", "Medical", "Legal", "Engineering", "Other"],
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
      default: "Intermediate",
    },
    description: {
      type: String,
      maxlength: 500,
    },
    examDate: Date,
    isOfficial: {
      type: Boolean,
      default: false, // User-created vs official qualifications
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

qualificationSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Qualification", qualificationSchema);