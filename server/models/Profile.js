import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      default: 'My sound profile',
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    frequency: {
      type: Number,
      required: true,
      min: 20,
      max: 18000,
    },
    noiseType: {
      type: String,
      enum: ['white', 'pink', 'brown'],
      required: true,
    },
    notchDepth: {
      type: Number,
      required: true,
    },
    binauralBeat: {
      type: Number,
      default: 0,
    },
    volume: {
      type: Number,
      default: 0.5,
      min: 0,
      max: 1,
    },
    aiSummary: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Profile', profileSchema);
