import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '~/database/BaseService.abstract';
import { Recompense } from '@Models/Recompense.entity';

@Injectable()
export class RecompenseService extends BaseService<Recompense> {
  constructor(
    @InjectRepository(Recompense)
    private readonly recompenseRepository: Repository<Recompense>,
  ) {
    super(recompenseRepository, []);
    this.recompenseRepository = recompenseRepository;
  }
}
