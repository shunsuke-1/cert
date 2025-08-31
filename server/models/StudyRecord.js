const mongoose = require("mongoose");

const studyRecordSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    qualification: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Qualification",
      required: true,
    },
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
    studyHours: {
      type: Number,
      min: 0,
      max: 24,
    },
    mood: {
      type: String,
      enum: ["😊", "😐", "😔", "🔥", "😴"],
      default: "😊",
    },
    tags: [String],
    isPublic: {
      type: Boolean,
      default: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

studyRecordSchema.index({ user: 1, createdAt: -1 });
studyRecordSchema.index({ qualification: 1, createdAt: -1 });
studyRecordSchema.index({ title: "text", content: "text" });

module.exports = mongoose.model("StudyRecord", studyRecordSchema);