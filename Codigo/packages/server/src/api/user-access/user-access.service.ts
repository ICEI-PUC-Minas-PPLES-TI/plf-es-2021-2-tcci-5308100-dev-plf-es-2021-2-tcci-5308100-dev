import { UserAccess } from '@Models/UserAccess.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '~/database/BaseService.abstract';
import * as moment from 'moment';

@Injectable()
export class UserAccessService extends BaseService<UserAccess> {
  constructor(
    @InjectRepository(UserAccess)
    private readonly userAccessRepository: Repository<UserAccess>,
  ) {
    super(userAccessRepository, []);
    this.userAccessRepository = userAccessRepository;
  }

  public async saveAccess(userId: number) {
    return await this.getRepository().save({
      accessDate: moment().format('YYYY/MM/DD HH:mm:ss'),
      user: <any>userId,
    });
  }
}
