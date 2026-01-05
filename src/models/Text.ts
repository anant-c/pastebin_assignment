import mongoose from 'mongoose';

const TextSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  expirationType: {
    type: String,
    enum: ['views', 'time'],
    required: true,
  },
  expiresAt: {
    type: Date,
    default: null,
  },
  maxViews: {
    type: Number,
    default: null,
  },
  views: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Text || mongoose.model('Text', TextSchema);