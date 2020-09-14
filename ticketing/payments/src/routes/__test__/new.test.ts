import { OrderStatus } from '@ajmoro/common';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Payment } from '../../models/payment';
import { stripe } from '../../stripe';
import { AuthHelper } from '../../test/auth-helper';

jest.mock('../../stripe.ts');

it('returns a 404 when purchasing an order that not exists', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', AuthHelper.getCookie())
    .send({
      token: '12121',
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it('returns a 401 when purchasing an order that does not belongs to the user', async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', AuthHelper.getCookie())
    .send({
      token: '12121',
      orderId: order.id,
    })
    .expect(401);
});

it('returns a 400 when purchasing a cancelled order', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const user = AuthHelper.getCookie(userId);
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  });

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', user)
    .send({
      token: '12121',
      orderId: order.id,
    })
    .expect(400);
});

it('returns a 204 with valid inputs', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const user = AuthHelper.getCookie(userId);
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', user)
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201);

  const chargedOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

  expect(chargedOptions.source).toEqual('tok_visa');
  expect(chargedOptions.amount).toEqual(order.price * 100);
  expect(chargedOptions.currency).toEqual('usd');

  const chargeResult = await (stripe.charges.create as jest.Mock).mock
    .results[0].value;

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: chargeResult.id,
  });

  expect(payment).toBeDefined();
  expect(payment!.orderId).toEqual(order.id);
  expect(payment!.stripeId).toEqual(chargeResult.id);
});
