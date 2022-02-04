import { Administrator } from '@Models/Administrator.entity';
import { User } from '@Models/User.entity';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Token } from '@sec/common';
import * as bcrypt from 'bcrypt';
import { AdministratorService } from '~/api/administrator/administrator.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private administratorService: AdministratorService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<Administrator> {
    const user = await this.administratorService.findByEmailWithPassword(email);

    if (!!user && (await bcrypt.compare(password, user.password))) {
      user.password = null;
      return user;
    }
    return undefined;
  }

  createToken(user: User) {
    const payload: Token = {
      id: user.id,
      email: user.email,
      name: user.name,
      type: user.profile.type,
    };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
