import TeachingStaff from '../models/TeachingStaff.js'
import { deleteFile } from '../middleware/upload.js'

export const createTeachingStaff = async (req, res) => {
  try {
    const { name, designation, category, dob, qualification, experience, dateOfAppointment, typeOfAppointment, order } = req.body
    const image = req.file ? `/uploads/images/${req.file.filename}` : null

    const teachingStaff = await TeachingStaff.create({
      name,
      designation,
      category: category || 'tgt',
      image,
      dob: dob || null,
      qualification,
      experience: experience || 0,
      dateOfAppointment: dateOfAppointment || null,
      typeOfAppointment: typeOfAppointment || 'permanent',
      order: order || 0
    })

    res.status(201).json({ success: true, data: teachingStaff })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getTeachingStaff = async (req, res) => {
  try {
    const teachingStaff = await TeachingStaff.find({ isActive: true }).sort({ order: 1, createdAt: -1 })
    res.json({ success: true, data: teachingStaff })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getAllTeachingStaff = async (req, res) => {
  try {
    const teachingStaff = await TeachingStaff.find().sort({ order: 1, createdAt: -1 })
    res.json({ success: true, data: teachingStaff })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getTeachingStaffById = async (req, res) => {
  try {
    const teachingStaff = await TeachingStaff.findById(req.params.id)
    if (!teachingStaff) {
      return res.status(404).json({ success: false, message: 'Teaching staff member not found' })
    }
    res.json({ success: true, data: teachingStaff })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const updateTeachingStaff = async (req, res) => {
  try {
    const teachingStaff = await TeachingStaff.findById(req.params.id)
    if (!teachingStaff) {
      return res.status(404).json({ success: false, message: 'Teaching staff member not found' })
    }

    const { name, designation, category, dob, qualification, experience, dateOfAppointment, typeOfAppointment, order, isActive } = req.body
    let image = teachingStaff.image

    if (req.file) {
      if (teachingStaff.image) {
        const oldPath = `uploads/images/${teachingStaff.image.split('/').pop()}`
        await deleteFile(oldPath)
      }
      image = `/uploads/images/${req.file.filename}`
    }

    const updated = await TeachingStaff.findByIdAndUpdate(
      req.params.id,
      { name, designation, category, image, dob, qualification, experience, dateOfAppointment, typeOfAppointment, order, isActive },
      { new: true }
    )

    res.json({ success: true, data: updated })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const deleteTeachingStaff = async (req, res) => {
  try {
    const teachingStaff = await TeachingStaff.findById(req.params.id)
    if (!teachingStaff) {
      return res.status(404).json({ success: false, message: 'Teaching staff member not found' })
    }

    if (teachingStaff.image) {
      const oldPath = `uploads/images/${teachingStaff.image.split('/').pop()}`
      await deleteFile(oldPath)
    }

    await teachingStaff.deleteOne()
    res.json({ success: true, message: 'Deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
