import request from 'supertest';
import { app } from '../../app';
import { AuthHelper } from '../../test/auth-helper';

it('returns a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: AuthHelper.email,
      password: AuthHelper.password,
    })
    .expect(201);
});

it('returns a 400 with an invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'test', password: AuthHelper.password })
    .expect(400);
});

it('returns a 400 with an invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: AuthHelper.email, password: 'p' })
    .expect(400);
});

it('returns a 400 with missing email and password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: AuthHelper.email })
    .expect(400);
  return request(app)
    .post('/api/users/signup')
    .send({ password: AuthHelper.password })
    .expect(400);
});

it('disallows duplicate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: AuthHelper.email, password: AuthHelper.password })
    .expect(201);
  return request(app)
    .post('/api/users/signup')
    .send({ email: AuthHelper.email, password: AuthHelper.password })
    .expect(400);
});

it('set a cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({ email: AuthHelper.email, password: AuthHelper.password })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
