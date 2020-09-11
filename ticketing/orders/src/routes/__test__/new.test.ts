import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { AuthHelper } from '../../test/auth-helper';

it('has a route handler listening to /api/orders for post requests', async () => {
  const response = await request(app).post('/api/orders').send({});
  expect(response.status).not.toEqual(404);
});
it('can only be accessed if user is signed in', async () => {
  const ticketId = mongoose.Types.ObjectId();
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
  const ticketId = mongoose.Types.ObjectId();

  await request(app)
    .post('/api/orders')
    .set('Cookie', AuthHelper.getCookie())
    .send({ ticketId })
    .expect(404);
});
it('returns an error if the ticket is already reserved', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();

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
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', AuthHelper.getCookie())
    .send({ ticketId: ticket.id })
    .expect(201);
});

// it('publish an event ', async () => {
//   // await request(app)
//   //   .post('/api/orders')
//   //   .set('Cookie', AuthHelper.getCookie())
//   //   .send({ title: 'a title', price: 10 })
//   //   .expect(201);
//   // expect(natsWrapper.client.publish).toHaveBeenCalled();
// });
