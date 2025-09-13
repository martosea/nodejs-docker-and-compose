import { Injectable } from '@nestjs/common';
import { hash, compare, genSalt } from 'bcrypt';

@Injectable()
export class HashService {
  async hashPassword(password: string) {
    const salt = await genSalt(10);
    return hash(password, salt);
  }

  async verifyPassword(password: string, hash: string) {
    return await compare(password, hash);
  }
}
