import express from 'express';
import { User } from '../models/User.js';

const router = express.Router();

router.post('/google-login', async (req, res) => {
  const { email, name, picture } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ email, name, picture });
    }

    res.status(200).json({ status: true, user });
  } catch (error) {
    console.error('Google login failed:', error);
    res.status(500).json({ status: false, message: 'Internal Server Error' });
  }
});

export default router;
