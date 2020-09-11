import request from 'supertest';
import { app } from '../app';
import { Ticket } from '../models/ticket';

export const createTicket = async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();
  return ticket;
};

export const createOrder = async (cookie: string[], ticketId: string) => {
  return await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId })
    .expect(201);
};
