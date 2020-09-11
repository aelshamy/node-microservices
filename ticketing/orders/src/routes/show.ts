import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@ajmoro/common';
import express, { Request, Response } from 'express';
import { param } from 'express-validator';
import mongoose from 'mongoose';
import { Order } from '../models/order';

const getOrderRouter = express.Router();

getOrderRouter.get(
  '/api/orders/:orderId',
  [
    param('orderId')
      .exists()
      .custom((orderId: string) => mongoose.Types.ObjectId.isValid(orderId))
      .withMessage('orderId is required'),
  ],
  validateRequest,
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    res.send(order);
  }
);

export { getOrderRouter };
