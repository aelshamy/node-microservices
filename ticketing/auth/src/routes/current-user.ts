import express from 'express';
import { userExists } from '../middlewares/user-exists';

const router = express.Router();

router.get('/api/users/currentuser', userExists, (req, res) => {
  return res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
