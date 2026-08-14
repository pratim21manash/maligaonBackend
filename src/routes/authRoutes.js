import express from 'express'
import { login, logout, checkAuth, changePassword } from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.post('/login', login)
router.post('/logout', logout)
router.get('/check', protect, checkAuth)
router.put('/change-password', protect, changePassword)

export default router
