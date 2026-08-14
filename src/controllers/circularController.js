import Circular from '../models/Circular.js'
import { deleteFile } from '../middleware/upload.js'

export const createCircular = async (req, res) => {
  try {
    const { title, description, date, time, order } = req.body
    const pdf = req.file ? `/uploads/circulars/${req.file.filename}` : null

    const circular = await Circular.create({
      title,
      description,
      date: date || new Date(),
      time: time || '00:00:00',
      pdf,
      order: order || 0
    })

    res.status(201).json({ success: true, data: circular })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getCirculars = async (req, res) => {
  try {
    const circulars = await Circular.find({ isActive: true }).sort({ date: -1, order: 1 })
    res.json({ success: true, data: circulars })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getAllCirculars = async (req, res) => {
  try {
    const circulars = await Circular.find().sort({ date: -1, order: 1 })
    res.json({ success: true, data: circulars })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getCircularById = async (req, res) => {
  try {
    const circular = await Circular.findById(req.params.id)
    if (!circular) {
      return res.status(404).json({ success: false, message: 'Circular not found' })
    }
    res.json({ success: true, data: circular })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const updateCircular = async (req, res) => {
  try {
    const circular = await Circular.findById(req.params.id)
    if (!circular) {
      return res.status(404).json({ success: false, message: 'Circular not found' })
    }

    const { title, description, date, time, order, isActive } = req.body
    let pdf = circular.pdf

    if (req.file) {
      if (circular.pdf) {
        const oldPath = `uploads/circulars/${circular.pdf.split('/').pop()}`
        await deleteFile(oldPath)
      }
      pdf = `/uploads/circulars/${req.file.filename}`
    }

    const updated = await Circular.findByIdAndUpdate(
      req.params.id,
      { title, description, date, time, pdf, order, isActive },
      { new: true }
    )

    res.json({ success: true, data: updated })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const deleteCircular = async (req, res) => {
  try {
    const circular = await Circular.findById(req.params.id)
    if (!circular) {
      return res.status(404).json({ success: false, message: 'Circular not found' })
    }

    if (circular.pdf) {
      const oldPath = `uploads/circulars/${circular.pdf.split('/').pop()}`
      await deleteFile(oldPath)
    }

    await circular.deleteOne()
    res.json({ success: true, message: 'Deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
