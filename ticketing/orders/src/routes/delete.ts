import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from '@ajmoro/common';
import express, { Request, Response } from 'express';
import { param } from 'express-validator';
import mongoose from 'mongoose';
import { Order } from '../models/order';

const deleteOrderRouter = express.Router();

deleteOrderRouter.patch(
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
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    res.send(order);
  }
);

export { deleteOrderRouter };
