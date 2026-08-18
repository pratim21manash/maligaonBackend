// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import helmet from "helmet";
// import morgan from "morgan";
// import path from "path";
// import { fileURLToPath } from "url";
// import dotenv from "dotenv";
// import fs from "fs-extra";
// import rateLimit from "express-rate-limit";
// import connectDB from "./config/database.js";

// import authRoutes from "./routes/authRoutes.js";
// import managementRoutes from "./routes/managementRoutes.js";
// import managingCommitteeRoutes from "./routes/managingCommitteeRoutes.js";
// import staffRoutes from "./routes/staffRoutes.js";
// import teachingStaffRoutes from "./routes/teachingStaffRoutes.js";
// import circularRoutes from "./routes/circularRoutes.js";
// import galleryRoutes from "./routes/galleryRoutes.js";
// import downloadRoutes from "./routes/downloadRoutes.js";

// dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// app.set("trust proxy", 1);

// const uploadDirs = [
//   path.join(__dirname, "../uploads"),
//   path.join(__dirname, "../uploads/images"),
//   path.join(__dirname, "../uploads/circulars"),
//   path.join(__dirname, "../uploads/downloads"),
// ];

// uploadDirs.forEach((dir) => fs.ensureDirSync(dir));

// // Connect to database
// connectDB();

// // Rate limit login attempts to slow brute-force attacks
// const loginLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 20,
//   message: {
//     success: false,
//     message: "Too many login attempts, please try again later.",
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// const allowedOrigins = [
//   process.env.CLIENT_URL || "http://localhost:5173",
//   "http://localhost:5174",
//   "https://backend-fix-maligaon.vercel.app",
//   "https://www.stmarysmaligaon.in",
// ];

// // Middleware
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // Allow requests with no origin (like mobile apps or curl requests)
//       if (!origin) return callback(null, true);

//       if (
//         allowedOrigins.indexOf(origin) !== -1 ||
//         origin === "http://localhost:5173"
//       ) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
//     allowedHeaders: [
//       "Content-Type",
//       "Authorization",
//       "Cookie",
//       "X-Requested-With",
//     ],
//   }),
// );
// app.use(
//   helmet({
//     crossOriginResourcePolicy: { policy: "cross-origin" },
//   }),
// );
// app.use(morgan("dev"));
// app.use(cookieParser());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Static files
// app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// // Apply rate limiting to login route specifically
// app.use("/api/auth/login", loginLimiter);

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/management", managementRoutes);
// app.use("/api/managing-committee", managingCommitteeRoutes);
// app.use("/api/staff", staffRoutes);
// app.use("/api/teaching-staff", teachingStaffRoutes);
// app.use("/api/circulars", circularRoutes);
// app.use("/api/gallery", galleryRoutes);
// app.use("/api/downloads", downloadRoutes);

// // Health check
// app.get("/api/health", (req, res) => {
//   res.json({ success: true, message: "API is running" });
// });

// // Error handling
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res
//     .status(500)
//     .json({ success: false, message: err.message || "Something went wrong!" });
// });

// // 404
// app.use((req, res) => {
//   res.status(404).json({ success: false, message: "Route not found" });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

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
app.set("trust proxy", 1);

// Create upload directories
const uploadDirs = [
  path.join(__dirname, "../uploads"),
  path.join(__dirname, "../uploads/images"),
  path.join(__dirname, "../uploads/circulars"),
  path.join(__dirname, "../uploads/downloads"),
];

uploadDirs.forEach((dir) => {
  fs.ensureDirSync(dir);
  console.log(`✅ Directory ready: ${dir}`);
});

// Connect to database
connectDB();

// Rate limit login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
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
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        origin === "http://localhost:5173"
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cookie",
      "X-Requested-With",
    ],
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

// ============================================================
// CRITICAL: Static file serving for uploads
// ============================================================
const uploadsPath = path.join(__dirname, "../uploads");
console.log(`📁 Serving static files from: ${uploadsPath}`);

// Serve everything under /uploads
app.use("/uploads", express.static(uploadsPath));

// Also serve specific subdirectories for clarity
app.use("/uploads/images", express.static(path.join(uploadsPath, "images")));
app.use(
  "/uploads/circulars",
  express.static(path.join(uploadsPath, "circulars")),
);
app.use(
  "/uploads/downloads",
  express.static(path.join(uploadsPath, "downloads")),
);

// Apply rate limiting to login route
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

// Debug endpoint to check uploaded files
app.get("/api/debug-files", async (req, res) => {
  try {
    const uploadsPath = path.join(__dirname, "../uploads");
    const files = [];

    const readDirRecursive = async (dir) => {
      const items = await fs.readdir(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = await fs.stat(fullPath);
        if (stat.isDirectory()) {
          await readDirRecursive(fullPath);
        } else {
          const relativePath = path.relative(uploadsPath, fullPath);
          files.push({
            name: item,
            path: `/${relativePath.replace(/\\/g, "/")}`,
            fullUrl: `/uploads/${relativePath.replace(/\\/g, "/")}`,
          });
        }
      }
    };

    await readDirRecursive(uploadsPath);
    res.json({
      success: true,
      uploadsPath,
      fileCount: files.length,
      files,
    });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
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
  console.log(`404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ success: false, message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Uploads directory: ${uploadsPath}`);
});
