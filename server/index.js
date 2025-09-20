const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const helmet = require('helmet');
const xssClean = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const articleRoutes = require("./routes/articles");
const commentRoutes = require("./routes/comments");
const qualificationRoutes = require("./routes/qualifications");
const studyRecordRoutes = require("./routes/studyRecords");
const adminRoutes = require("./routes/admin");

const app = express();
app.use(helmet());
app.use(xssClean());
app.use(mongoSanitize());
app.use(cookieParser());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many requests, please try again later.',
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Middleware
const allowedOrigins = [process.env.FRONTEND_URL || "http://localhost:3000"];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/qualifications", qualificationRoutes);
app.use("/api/study-records", studyRecordRoutes);
app.use("/api/admin", adminRoutes);

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/certstudy")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
