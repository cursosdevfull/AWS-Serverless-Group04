import * as jwt from 'jsonwebtoken';

export class TokenService {
  static create(name: string, email: string): string {
    const token = jwt.sign({ name, email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return token;
  }

  static verify(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
  }
}
