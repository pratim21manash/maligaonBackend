import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import fs from "fs-extra";
import rateLimit from "express-rate-limit";
import connectDB from "./config/database.js";

import authRoutes from "./routes/authRoutes.js";
import managementRoutes from "./routes/managementRoutes.js";
import managingCommitteeRoutes from "./routes/managingCommitteeRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";
import teachingStaffRoutes from "./routes/teachingStaffRoutes.js";
import circularRoutes from "./routes/circularRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import downloadRoutes from "./routes/downloadRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const uploadDirs = [
  path.join(__dirname, "../uploads"),
  path.join(__dirname, "../uploads/images"),
  path.join(__dirname, "../uploads/circulars"),
  path.join(__dirname, "../uploads/downloads"),
];

uploadDirs.forEach((dir) => fs.ensureDirSync(dir));

// Connect to database
connectDB();

// Rate limit login attempts to slow brute-force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: {
    success: false,
    message: "Too many login attempts, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173",
  "http://localhost:5174",
  "https://backend-fix-maligaon.vercel.app",
  "https://www.stmarysmaligaon.in",
];

// Middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Apply rate limiting to login route specifically
app.use("/api/auth/login", loginLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/management", managementRoutes);
app.use("/api/managing-committee", managingCommitteeRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/teaching-staff", teachingStaffRoutes);
app.use("/api/circulars", circularRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/downloads", downloadRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "API is running" });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ success: false, message: err.message || "Something went wrong!" });
});

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
