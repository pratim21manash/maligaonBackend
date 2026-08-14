import Staff from '../models/Staff.js'
import { deleteFile } from '../middleware/upload.js'

export const createStaff = async (req, res) => {
  try {
    const { name, designation, dob, qualification, experience, dateOfAppointment, typeOfAppointment, order } = req.body
    const image = req.file ? `/uploads/images/${req.file.filename}` : null

    const staff = await Staff.create({
      name,
      designation,
      image,
      dob: dob || null,
      qualification,
      experience: experience || 0,
      dateOfAppointment: dateOfAppointment || null,
      typeOfAppointment: typeOfAppointment || 'permanent',
      order: order || 0
    })

    res.status(201).json({ success: true, data: staff })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getStaff = async (req, res) => {
  try {
    const staff = await Staff.find({ isActive: true }).sort({ order: 1, createdAt: -1 })
    res.json({ success: true, data: staff })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find().sort({ order: 1, createdAt: -1 })
    res.json({ success: true, data: staff })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id)
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff member not found' })
    }
    res.json({ success: true, data: staff })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id)
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff member not found' })
    }

    const { name, designation, dob, qualification, experience, dateOfAppointment, typeOfAppointment, order, isActive } = req.body
    let image = staff.image

    if (req.file) {
      if (staff.image) {
        const oldPath = `uploads/images/${staff.image.split('/').pop()}`
        await deleteFile(oldPath)
      }
      image = `/uploads/images/${req.file.filename}`
    }

    const updated = await Staff.findByIdAndUpdate(
      req.params.id,
      { name, designation, image, dob, qualification, experience, dateOfAppointment, typeOfAppointment, order, isActive },
      { new: true }
    )

    res.json({ success: true, data: updated })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id)
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff member not found' })
    }

    if (staff.image) {
      const oldPath = `uploads/images/${staff.image.split('/').pop()}`
      await deleteFile(oldPath)
    }

    await staff.deleteOne()
    res.json({ success: true, message: 'Deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
