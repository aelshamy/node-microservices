import request from 'supertest';
import { app } from '../../app';
import { AuthHelper } from '../../test/auth-helper';

it('fails with an email that does not exists is supplied', async () => {
  return request(app)
    .post('/api/users/signin')
    .send({
      email: AuthHelper.email,
      password: AuthHelper.password,
    })
    .expect(400);
});

it('fails when an incorrect password is supplied', async () => {
  await AuthHelper.signup();

  return request(app)
    .post('/api/users/signin')
    .send({
      email: AuthHelper.email,
      password: 'p',
    })
    .expect(400);
});

it('responds with a cookie when give a valid credentials', async () => {
  await AuthHelper.signup();

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: AuthHelper.email,
      password: AuthHelper.password,
    })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined;
});
