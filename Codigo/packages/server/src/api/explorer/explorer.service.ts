import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '~/database/BaseService.abstract';
import { Explorer } from '@Models/Explorer.entity';

@Injectable()
export class ExplorerService extends BaseService<Explorer> {
  constructor(
    @InjectRepository(Explorer)
    private readonly explorerRepository: Repository<Explorer>,
  ) {
    super(explorerRepository, []);
    this.explorerRepository = explorerRepository;
  }
}
