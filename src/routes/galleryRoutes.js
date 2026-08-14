import express from "express";
import {
  createGallery,
  getGalleries,
  getAllGalleries,
  getGalleryById,
  updateGallery,
  deleteGallery,
  toggleGalleryStatus,
} from "../controllers/galleryController.js";
import { protect } from "../middleware/auth.js";
import { uploadMultipleImages } from "../middleware/upload.js";

const router = express.Router();

// Public routes
router.get("/", getGalleries);

// Admin routes
router.get("/all", protect, getAllGalleries);
router.get("/:id", getGalleryById);
router.post("/", protect, uploadMultipleImages, createGallery);
router.put("/:id", protect, uploadMultipleImages, updateGallery);
router.delete("/:id", protect, deleteGallery);
router.patch("/:id/toggle", protect, toggleGalleryStatus);

export default router;
