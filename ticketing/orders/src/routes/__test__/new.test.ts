import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';
import { AuthHelper } from '../../test/auth-helper';
import { createTicket } from '../../test/util';

it('has a route handler listening to /api/orders for post requests', async () => {
  const response = await request(app).post('/api/orders').send({});
  expect(response.status).not.toEqual(404);
});
it('can only be accessed if user is signed in', async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString();
  await request(app).post('/api/orders').send({ ticketId }).expect(401);
});

it('returns an error if invalid ticket id provided', async () => {
  await request(app)
    .post('/api/orders')
    .set('Cookie', AuthHelper.getCookie())
    .send({ ticketId: '123' })
    .expect(400);
});

it('returns an error if the ticket does not exists', async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .post('/api/orders')
    .set('Cookie', AuthHelper.getCookie())
    .send({ ticketId })
    .expect(404);
});
it('returns an error if the ticket is already reserved', async () => {
  const ticket = await createTicket();

  const order = Order.build({
    ticket,
    userId: 'adfadsfdsa',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });

  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', AuthHelper.getCookie())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('reserves a ticket', async () => {
  const ticket = await createTicket();

  await request(app)
    .post('/api/orders')
    .set('Cookie', AuthHelper.getCookie())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
