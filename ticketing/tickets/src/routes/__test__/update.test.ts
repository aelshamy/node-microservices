import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';
import { AuthHelper } from '../../test/auth-helper';

it('it returns 404 if the provided id does not exists', async () => {
  const title = 'concert';
  const price = 10;
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', AuthHelper.getCookie())
    .send({ title, price })
    .expect(404);
});

it('it returns 404 if user is not authenticated', async () => {
  const title = 'concert';
  const price = 10;
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title, price })
    .expect(401);
});

it('it rejects updates if the ticket is reserved', async () => {
  const title = 'concert';
  const price = 10;
  const user = AuthHelper.getCookie();
  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', user)
    .send({ title, price })
    .expect(201);

  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({ orderId: '123' });
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${ticket!.id}`)
    .set('Cookie', user)
    .send({ title, price })
    .expect(400);
});

it('it returns 401 if user does not own the ticket', async () => {
  const title = 'concert';
  const price = 10;
  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', AuthHelper.getCookie())
    .send({ title, price })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', AuthHelper.getCookie())
    .send({ title, price })
    .expect(401);
});

it('it returns 400 if user provide an invalid title or price', async () => {
  const title = 'concert';
  const price = 10;
  const cookie = AuthHelper.getCookie();
  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({ title, price })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: '', price: 10 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title, price: -10 })
    .expect(400);
});

it('updates the ticket provided valid inputs', async () => {
  const title = 'concert';
  const price = 10;
  const cookie = AuthHelper.getCookie();

  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({ title, price })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title, price })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});

it('publish an event ', async () => {
  const title = 'concert';
  const price = 10;
  const cookie = AuthHelper.getCookie();
  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({ title, price })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title, price })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
