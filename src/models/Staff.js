import mongoose from 'mongoose'

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  designation: { type: String, required: true, trim: true },
  image: { type: String, default: null },
  dob: { type: Date },
  qualification: { type: String, trim: true },
  experience: { type: Number, default: 0 },
  dateOfAppointment: { type: Date },
  typeOfAppointment: {
    type: String,
    enum: ['permanent', 'contract', 'temporary'],
    default: 'permanent'
  },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

const Staff = mongoose.model('Staff', staffSchema)
export default Staff
