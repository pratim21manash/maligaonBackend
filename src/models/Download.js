import mongoose from 'mongoose'

const downloadSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  file: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true })

const Download = mongoose.model('Download', downloadSchema)
export default Download
