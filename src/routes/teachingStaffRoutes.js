import express from 'express'
import {
  createTeachingStaff,
  getTeachingStaff,
  getAllTeachingStaff,
  getTeachingStaffById,
  updateTeachingStaff,
  deleteTeachingStaff
} from '../controllers/teachingStaffController.js'
import { protect } from '../middleware/auth.js'
import { uploadImage, compressSingleImage } from '../middleware/upload.js'

const router = express.Router()

router.post('/', protect, uploadImage.single('image'), compressSingleImage, createTeachingStaff)
router.get('/', getTeachingStaff)
router.get('/all', protect, getAllTeachingStaff)
router.get('/:id', getTeachingStaffById)
router.put('/:id', protect, uploadImage.single('image'), compressSingleImage, updateTeachingStaff)
router.delete('/:id', protect, deleteTeachingStaff)

export default router
