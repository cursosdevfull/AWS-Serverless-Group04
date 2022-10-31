import * as jwt from 'jsonwebtoken';

export class TokenService {
  static create(name: string, email: string): string {
    const token = jwt.sign({ name, email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return token;
  }
}
