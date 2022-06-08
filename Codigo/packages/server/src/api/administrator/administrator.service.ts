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
import { EmailService } from '~/email/email.service';

@Injectable()
export class AdministratorService extends BaseService<Administrator> {
  constructor(
    @InjectRepository(Administrator)
    private readonly administratorRepository: Repository<Administrator>,
    private readonly profileService: ProfileService,
    private readonly emailService: EmailService,
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

  public async createAndSendPassword(
    data: CreateAdministratorDTO,
  ): Promise<Administrator> {
    if (data.randomPassword)
      data.password === this.utilsService.generateRandomString(8);

    const administrator = await this.createAndSave(data);

    console.log(!!administrator && !!data.password)
    if (!!administrator && !!data.password)
      await this.emailService.newPasswordToAdministrator(
        administrator,
        data.password,
      );

    return administrator;
  }

  public async updateByIdAndSendPassword(
    id: number,
    data: UpdateAdministratorDTO,
  ): Promise<Administrator> {
    if (data.randomPassword)
      data.password = this.utilsService.generateRandomString(8);

    const administrator = await this.updateById(id, data);

    if (!!administrator && !!data.password)
      await this.emailService.newPasswordToAdministrator(
        administrator,
        data.password,
      );

    return administrator;
  }
}
