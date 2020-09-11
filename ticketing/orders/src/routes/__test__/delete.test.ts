import { OrderStatus } from '@ajmoro/common';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';
import { AuthHelper } from '../../test/auth-helper';
import { createOrder, createTicket } from '../../test/util';

it('can only be accessed if user is signed in', async () => {
  const orderId = mongoose.Types.ObjectId();
  await request(app).patch(`/api/orders/${orderId}`).send().expect(401);
});

it('returns an error if invalid order id provided', async () => {
  await request(app)
    .patch('/api/orders/123')
    .set('Cookie', AuthHelper.getCookie())
    .send()
    .expect(400);
});

it('returns a 404 if order is not found', async () => {
  const orderId = new mongoose.Types.ObjectId();
  await request(app)
    .patch(`/api/orders/${orderId}`)
    .set('Cookie', AuthHelper.getCookie())
    .send()
    .expect(404);
});

it('returns a 401 if the user is not the same as the one created the order', async () => {
  const userOne = AuthHelper.getCookie();
  const userTwo = AuthHelper.getCookie();
  const ticketOne = await createTicket();
  const { body: OrderOne } = await createOrder(userOne, ticketOne.id);

  await request(app)
    .patch(`/api/orders/${OrderOne.id}`)
    .set('Cookie', userTwo)
    .send()
    .expect(401);
});

it('cancels the order', async () => {
  const user = AuthHelper.getCookie();
  const ticket = await createTicket();
  const { body: order } = await createOrder(user, ticket.id);

  const { body: fetchedOrder } = await request(app)
    .patch(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  const updatedOrder = await Order.findById(order.id);

  expect(fetchedOrder.id).toEqual(order.id);
  expect(fetchedOrder.status).toEqual(OrderStatus.Cancelled);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
