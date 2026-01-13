import { Router } from 'express';
import { Store } from '../models/index.js';
import authMiddleware from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const store = await Store.findByPk(req.user.storeId);

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    res.json({ store });
  } catch (error) {
    console.error('Error fetching store:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
