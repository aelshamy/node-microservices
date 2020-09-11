import request from 'supertest';
import { app } from '../../app';
import { AuthHelper } from '../../test/auth-helper';
import { createOrder, createTicket } from '../../test/util';

it('fetches order for particular user', async () => {
  const userOne = AuthHelper.getCookie();
  const userTwo = AuthHelper.getCookie();

  const ticketOne = await createTicket();
  const ticketTwo = await createTicket();
  const ticketThree = await createTicket();

  await createOrder(userOne, ticketOne.id);
  const { body: OrderOne } = await createOrder(userTwo, ticketTwo.id);
  const { body: OrderTwo } = await createOrder(userTwo, ticketThree.id);

  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .send()
    .expect(200);

  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(OrderOne.id);
  expect(response.body[1].id).toEqual(OrderTwo.id);
  expect(response.body[0].ticket.id).toEqual(ticketTwo.id);
  expect(response.body[1].ticket.id).toEqual(ticketThree.id);
});
