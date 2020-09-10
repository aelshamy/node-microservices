import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { AuthHelper } from '../../test/auth-helper';

const createTicket = () => {
  const title = 'concert';
  const price = 10;

  return request(app)
    .post('/api/tickets')
    .set('Cookie', AuthHelper.getCookie())
    .send({ title, price })
    .expect(201);
};

it('can fetch list of tickets', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app).get('/api/tickets').send().expect(200);

  expect(response.body.length).toEqual(3);
});
