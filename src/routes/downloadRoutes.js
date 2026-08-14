import express from "express";
import {
  createDownload,
  getDownloads,
  getAllDownloads,
  getDownloadById,
  updateDownload,
  deleteDownload,
  toggleDownloadStatus, // Add this import
} from "../controllers/downloadController.js";
import { protect } from "../middleware/auth.js";
import { uploadDownload } from "../middleware/upload.js";

const router = express.Router();

// Public routes
router.get("/", getDownloads);

// Admin routes
router.get("/all", protect, getAllDownloads);
router.get("/:id", getDownloadById);
router.post("/", protect, uploadDownload.single("file"), createDownload);
router.post("/upload", protect, uploadDownload.single("file"), createDownload);
router.put("/:id", protect, uploadDownload.single("file"), updateDownload);
router.delete("/:id", protect, deleteDownload);
router.patch("/:id/toggle", protect, toggleDownloadStatus); // Add this route

export default router;
