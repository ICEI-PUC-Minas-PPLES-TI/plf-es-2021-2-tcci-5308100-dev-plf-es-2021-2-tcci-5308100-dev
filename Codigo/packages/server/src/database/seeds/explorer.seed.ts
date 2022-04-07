import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ISeed from '~/database/seed.interface';
import { ExplorerStatus } from '@sec/common';
import { Explorer } from '@Models/Explorer.entity';

export class ExplorerSeed implements ISeed {
  constructor(
    @InjectRepository(Explorer)
    private readonly explorerRepository: Repository<Explorer>,
  ) {}

  async seed() {
    await this.explorerRepository.save({
      nickname: 'teste',
      email: 'explorer@email.com',
      name: 'Explorador Teste',
      profile: 3 as any,
      status: ExplorerStatus.ACTIVE,
    });
  }
}
