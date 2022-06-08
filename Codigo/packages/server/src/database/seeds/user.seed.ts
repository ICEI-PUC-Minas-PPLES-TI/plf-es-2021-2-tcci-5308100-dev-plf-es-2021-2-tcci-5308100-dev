import { Administrator } from '@Models/Administrator.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ISeed from '~/database/seed.interface';
import * as bcrypt from 'bcrypt';
import { AdministratorStatus } from '@sec/common';

export class UserSeed implements ISeed {
  constructor(
    @InjectRepository(Administrator)
    private readonly administratorRepository: Repository<Administrator>,
  ) {}

  async seed() {
    const superAdmin = this.administratorRepository.create({
      nickname: 'sudo -s',
      email: 'sudo@email.com',
      name: 'Super administrador',
      profile: 1 as any,
      password: await bcrypt.hash('superAdmin', 10),
      isSuper: true,
      status: AdministratorStatus.ACTIVE,
    });

    const admin = this.administratorRepository.create({
      nickname: 'admin',
      email: 'admin@email.com',
      name: 'Administrador',
      profile: 2 as any,
      password: await bcrypt.hash('admin', 10),
      isSuper: false,
      status: AdministratorStatus.ACTIVE,
    });

    await this.administratorRepository.save([superAdmin, admin]);
  }
}
