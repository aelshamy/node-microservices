import request from 'supertest';
import { app } from '../../app';
import { AuthHelper } from '../../test/auth-helper';

it('clears the cookie after signing out', async () => {
  await AuthHelper.signup();

  const response = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200);

  expect(response.get('Set-Cookie')[0]).toEqual(
    'express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
  );
});
