import mongoose from 'mongoose'

const gallerySchema = new mongoose.Schema({
  eventName: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  images: [{
    url: String,
    caption: String
  }],
  date: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

const Gallery = mongoose.model('Gallery', gallerySchema)
export default Gallery
