import { Injectable } from '@nestjs/common';

import bcrypt from 'bcrypt';

@Injectable()
export class HashingService {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
