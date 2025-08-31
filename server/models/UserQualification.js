const mongoose = require("mongoose");

const userQualificationSchema = new mongoose.Schema(
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
    status: {
      type: String,
      enum: ["studying", "passed", "failed", "planning"],
      default: "studying",
    },
    targetDate: Date,
    passedDate: Date,
    score: String,
    notes: String,
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

userQualificationSchema.index({ user: 1 });
userQualificationSchema.index({ qualification: 1 });

module.exports = mongoose.model("UserQualification", userQualificationSchema);