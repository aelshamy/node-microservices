import { requireAuth } from '@ajmoro/common';
import express, { Request, Response } from 'express';
import { Order } from '../models/order';

const ordersListRouter = express.Router();

ordersListRouter.get(
  '/api/orders',
  requireAuth,
  async (req: Request, res: Response) => {
    const orders = await Order.find({ userId: req.currentUser!.id }).populate(
      'ticket'
    );
    res.send(orders);
  }
);

export { ordersListRouter };
