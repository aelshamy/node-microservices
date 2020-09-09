import { userExists } from '@ajmoro/common';
import express from 'express';

const router = express.Router();

router.get('/api/users/currentuser', userExists, (req, res) => {
  return res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
