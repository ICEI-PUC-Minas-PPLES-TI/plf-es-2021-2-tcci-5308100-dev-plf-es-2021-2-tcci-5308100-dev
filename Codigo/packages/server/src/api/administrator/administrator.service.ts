import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, In, Repository } from 'typeorm';
import { BaseService } from '~/database/BaseService.abstract';
import { Administrator } from '@Models/Administrator.entity';
import { ProfileService } from '../profile/profile.service';
import * as bcrypt from 'bcrypt';
import { UtilsService } from '~/utils/utils.service';
import {
  CreateAdministratorDTO,
  UpdateAdministratorDTO,
  UserType,
} from '@sec/common';

@Injectable()
export class AdministratorService extends BaseService<Administrator> {
  constructor(
    @InjectRepository(Administrator)
    private readonly administratorRepository: Repository<Administrator>,
    private readonly profileService: ProfileService,
    private readonly utilsService: UtilsService,
  ) {
    super(administratorRepository, []);
    this.administratorRepository = administratorRepository;
  }

  async findByEmailWithPassword(
    email: string,
  ): Promise<Administrator | undefined> {
    try {
      const administrator = await this.administratorRepository.findOneOrFail({
        where: {
          email: email,
          profile: {
            type: In([UserType.SUPER_ADMINISTRATOR, UserType.ADMINISTRATOR]),
          },
        },
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

  public async create(data: CreateAdministratorDTO): Promise<Administrator> {
    const profile = await this.profileService.findOne({
      where: { type: UserType.ADMINISTRATOR },
    });

    const password = await bcrypt.hash(
      data.password || this.utilsService.generateRandomString(8),
      10,
    );

    const administrator = await super.create({
      ...data,
      password: password,
      profile: profile,
    });
    return administrator;
  }

  public async updateById(
    id: number,
    data: UpdateAdministratorDTO,
  ): Promise<Administrator> {
    const password =
      data.randomPassword || !!data.password
        ? await bcrypt.hash(
            data.password || this.utilsService.generateRandomString(8),
            10,
          )
        : undefined;

    return super.updateById(id, {
      ...data,
      password: password,
    });
  }
}
