import ManagingCommittee from '../models/ManagingCommittee.js'
import { deleteFile } from '../middleware/upload.js'

export const createCommittee = async (req, res) => {
  try {
    const { name, designation, address, tenure, order } = req.body
    const image = req.file ? `/uploads/images/${req.file.filename}` : null

    const committee = await ManagingCommittee.create({
      name,
      designation,
      image,
      address,
      tenure,
      order: order || 0
    })

    res.status(201).json({ success: true, data: committee })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getCommittee = async (req, res) => {
  try {
    const committee = await ManagingCommittee.find({ isActive: true }).sort({ order: 1, createdAt: -1 })
    res.json({ success: true, data: committee })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getAllCommittee = async (req, res) => {
  try {
    const committee = await ManagingCommittee.find().sort({ order: 1, createdAt: -1 })
    res.json({ success: true, data: committee })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getCommitteeById = async (req, res) => {
  try {
    const committee = await ManagingCommittee.findById(req.params.id)
    if (!committee) {
      return res.status(404).json({ success: false, message: 'Committee member not found' })
    }
    res.json({ success: true, data: committee })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const updateCommittee = async (req, res) => {
  try {
    const committee = await ManagingCommittee.findById(req.params.id)
    if (!committee) {
      return res.status(404).json({ success: false, message: 'Committee member not found' })
    }

    const { name, designation, address, tenure, order, isActive } = req.body
    let image = committee.image

    if (req.file) {
      if (committee.image) {
        const oldPath = `uploads/images/${committee.image.split('/').pop()}`
        await deleteFile(oldPath)
      }
      image = `/uploads/images/${req.file.filename}`
    }

    const updated = await ManagingCommittee.findByIdAndUpdate(
      req.params.id,
      { name, designation, image, address, tenure, order, isActive },
      { new: true }
    )

    res.json({ success: true, data: updated })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const deleteCommittee = async (req, res) => {
  try {
    const committee = await ManagingCommittee.findById(req.params.id)
    if (!committee) {
      return res.status(404).json({ success: false, message: 'Committee member not found' })
    }

    if (committee.image) {
      const oldPath = `uploads/images/${committee.image.split('/').pop()}`
      await deleteFile(oldPath)
    }

    await committee.deleteOne()
    res.json({ success: true, message: 'Deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
