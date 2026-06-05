import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Profile from '../models/Profile.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const profiles = await Profile.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { name, description, frequency, noiseType, notchDepth, binauralBeat, volume, aiSummary } = req.body;

    if (!frequency || !noiseType || notchDepth === undefined) {
      return res.status(400).json({ message: 'Missing required profile fields' });
    }

    const profile = await Profile.create({
      userId: req.user._id,
      name: name || 'My sound profile',
      description,
      frequency,
      noiseType,
      notchDepth,
      binauralBeat: binauralBeat || 0,
      volume: volume || 0.5,
      aiSummary,
    });

    res.status(201).json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const profile = await Profile.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json({ message: 'Profile deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
