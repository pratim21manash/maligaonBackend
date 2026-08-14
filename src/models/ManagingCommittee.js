import mongoose from 'mongoose'

const managingCommitteeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  designation: { type: String, required: true, trim: true },
  image: { type: String, default: null },
  address: { type: String, trim: true },
  tenure: { type: String, trim: true },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

const ManagingCommittee = mongoose.model('ManagingCommittee', managingCommitteeSchema)
export default ManagingCommittee
