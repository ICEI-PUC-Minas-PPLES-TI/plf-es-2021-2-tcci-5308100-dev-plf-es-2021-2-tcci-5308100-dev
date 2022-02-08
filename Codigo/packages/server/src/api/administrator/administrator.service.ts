import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '~/database/BaseService.abstract';
import { Administrator } from '@Models/Administrator.entity';

@Injectable()
export class AdministratorService extends BaseService<Administrator> {
  constructor(
    @InjectRepository(Administrator)
    private readonly administratorRepository: Repository<Administrator>,
  ) {
    super(administratorRepository, []);
    this.administratorRepository = administratorRepository;
  }

  async findByEmailWithPassword(
    email: string,
  ): Promise<Administrator | undefined> {
    try {
      const administrator = await this.administratorRepository.findOneOrFail({
        where: { email: email },
        relations: ['profile'],
      });
      administrator.password = (
        await this.administratorRepository.findOneOrFail({
          where: { email: email },
          select: ['password'],
        })
      ).password;

      return administrator;
    } catch (error) {
      return undefined;
    }
  }
}
