import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { AuthHelper } from '../../test/auth-helper';
it('has a route handler listening to /api/tickets for post requests, async', async () => {
  const response = await request(app).post('/api/tickets').send({});
  expect(response.status).not.toEqual(404);
});
it('can only be accessed if user is signed in', async () => {
  await request(app)
    .post('/api/tickets')
    .send({ title: 'a title', price: 10 })
    .expect(401);
});

it('returns status other than 401 if the user signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', AuthHelper.getCookie())
    .send({ title: 'a title', price: 10 });
  expect(response.status).not.toEqual(401);
});

it('returns an error if invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', AuthHelper.getCookie())
    .send({ title: '', price: 10 })
    .expect(400);
  await request(app)
    .post('/api/tickets')
    .set('Cookie', AuthHelper.getCookie())
    .send({ price: 10 })
    .expect(400);
});
it('returns an error if invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', AuthHelper.getCookie())
    .send({ price: -10 })
    .expect(400);
  await request(app)
    .post('/api/tickets')
    .set('Cookie', AuthHelper.getCookie())
    .send({ title: 'a title' })
    .expect(400);
});
it('creates a ticket with a valid inputs', async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', AuthHelper.getCookie())
    .send({ title: 'a title', price: 10 })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(10);
  expect(tickets[0].title).toEqual('a title');
});
