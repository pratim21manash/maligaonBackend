import Management from '../models/Management.js'
import { deleteFile } from '../middleware/upload.js'

export const createManagement = async (req, res) => {
  try {
    const { name, designation, order } = req.body
    const image = req.file ? `/uploads/images/${req.file.filename}` : null

    const management = await Management.create({
      name,
      designation,
      image,
      order: order || 0
    })

    res.status(201).json({ success: true, data: management })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getManagement = async (req, res) => {
  try {
    const management = await Management.find({ isActive: true }).sort({ order: 1, createdAt: -1 })
    res.json({ success: true, data: management })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getAllManagement = async (req, res) => {
  try {
    const management = await Management.find().sort({ order: 1, createdAt: -1 })
    res.json({ success: true, data: management })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getManagementById = async (req, res) => {
  try {
    const management = await Management.findById(req.params.id)
    if (!management) {
      return res.status(404).json({ success: false, message: 'Management member not found' })
    }
    res.json({ success: true, data: management })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const updateManagement = async (req, res) => {
  try {
    const management = await Management.findById(req.params.id)
    if (!management) {
      return res.status(404).json({ success: false, message: 'Management member not found' })
    }

    const { name, designation, order, isActive } = req.body
    let image = management.image

    if (req.file) {
      if (management.image) {
        const oldPath = `uploads/images/${management.image.split('/').pop()}`
        await deleteFile(oldPath)
      }
      image = `/uploads/images/${req.file.filename}`
    }

    const updated = await Management.findByIdAndUpdate(
      req.params.id,
      { name, designation, image, order, isActive },
      { new: true }
    )

    res.json({ success: true, data: updated })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const deleteManagement = async (req, res) => {
  try {
    const management = await Management.findById(req.params.id)
    if (!management) {
      return res.status(404).json({ success: false, message: 'Management member not found' })
    }

    if (management.image) {
      const oldPath = `uploads/images/${management.image.split('/').pop()}`
      await deleteFile(oldPath)
    }

    await management.deleteOne()
    res.json({ success: true, message: 'Deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
