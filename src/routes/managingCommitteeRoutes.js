import express from 'express'
import {
  createCommittee,
  getCommittee,
  getAllCommittee,
  getCommitteeById,
  updateCommittee,
  deleteCommittee
} from '../controllers/managingCommitteeController.js'
import { protect } from '../middleware/auth.js'
import { uploadImage, compressSingleImage } from '../middleware/upload.js'

const router = express.Router()

router.post('/', protect, uploadImage.single('image'), compressSingleImage, createCommittee)
router.get('/', getCommittee)
router.get('/all', protect, getAllCommittee)
router.get('/:id', getCommitteeById)
router.put('/:id', protect, uploadImage.single('image'), compressSingleImage, updateCommittee)
router.delete('/:id', protect, deleteCommittee)

export default router
