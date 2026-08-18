// import express from 'express'
// import {
//   createManagement,
//   getManagement,
//   getAllManagement,
//   getManagementById,
//   updateManagement,
//   deleteManagement
// } from '../controllers/managementController.js'
// import { protect } from '../middleware/auth.js'
// import { uploadImage, compressSingleImage } from '../middleware/upload.js'

// const router = express.Router()

// router.post('/', protect, uploadImage.single('image'), compressSingleImage, createManagement)
// router.get('/', getManagement)
// router.get('/all', protect, getAllManagement)
// router.get('/:id', getManagementById)
// router.put('/:id', protect, uploadImage.single('image'), compressSingleImage, updateManagement)
// router.delete('/:id', protect, deleteManagement)

// export default router

import express from "express";
import {
  createManagement,
  getManagement,
  getAllManagement,
  getManagementById,
  updateManagement,
  deleteManagement,
} from "../controllers/managementController.js";
import { protect } from "../middleware/auth.js";
import { uploadImage, compressSingleImage } from "../middleware/upload.js";

const router = express.Router();

router.post(
  "/",
  protect,
  uploadImage.single("image"),
  compressSingleImage,
  createManagement,
);
router.get("/", getManagement);
router.get("/all", protect, getAllManagement);
router.get("/:id", getManagementById);
router.put(
  "/:id",
  protect,
  uploadImage.single("image"),
  compressSingleImage,
  updateManagement,
);
router.delete("/:id", protect, deleteManagement);

export default router;
