import mongoose from 'mongoose'

const circularSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  date: { type: Date, required: true, default: Date.now },
  time: { type: String, default: '00:00:00' },
  pdf: { type: String, default: null },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true })

const Circular = mongoose.model('Circular', circularSchema)
export default Circular
