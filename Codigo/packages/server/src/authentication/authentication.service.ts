import { Administrator } from '@Models/Administrator.entity';
import { User } from '@Models/User.entity';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Token } from '@sec/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthenticationService {
  constructor(private jwtService: JwtService) {}

  async validateUser(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  createToken(user: Token) {
    return {
      token: this.jwtService.sign(user),
    };
  }
}
