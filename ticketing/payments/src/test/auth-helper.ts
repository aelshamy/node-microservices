import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export class AuthHelper {
  static email = 'test@test.com';
  static password = 'password';

  static getCookie(id?: string): string[] {
    const payload = {
      id: id || new mongoose.Types.ObjectId().toHexString(),
      email: this.email,
    };

    const token = jwt.sign(payload, process.env.JWT_KEY!);
    const session = { jwt: token };

    const sessionJson = JSON.stringify(session);

    const base64 = Buffer.from(sessionJson).toString('base64');

    return [`express:sess=${base64}`];
  }
}
