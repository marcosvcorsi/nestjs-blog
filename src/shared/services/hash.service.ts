import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as bcrypt from 'bcryptjs';

@Injectable()
export class HashService {
  constructor(private readonly configService: ConfigService) {}

  async hash(value: string): Promise<string> {
    const salt = await bcrypt.genSalt(
      Number(this.configService.get<number>('HASH_SALT')),
    );

    return bcrypt.hash(value, salt);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }
}
