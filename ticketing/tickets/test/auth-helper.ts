import request from 'supertest';
import { app } from '../app';

export class AuthHelper {
  static email = 'test@test.com';
  static password = 'password';

  static async signup(): Promise<string[]> {
    const response = await request(app)
      .post('/api/users/signup')
      .send({ email: this.email, password: this.password })
      .expect(201);

    return response.get('Set-Cookie');
  }
}
