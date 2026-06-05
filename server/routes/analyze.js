import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { analyzeTinnitus } from '../services/geminiService.js';

const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const { description } = req.body;

    if (!description || description.trim().length < 10) {
      return res.status(400).json({
        message: 'Please provide a more detailed description of your tinnitus',
      });
    }

    const profile = await analyzeTinnitus(description.trim());
    res.json(profile);
  } catch (err) {
    console.error('Analyze error:', err.message);
    res.status(500).json({ message: 'Failed to generate profile. Please try again.' });
  }
});

export default router;
