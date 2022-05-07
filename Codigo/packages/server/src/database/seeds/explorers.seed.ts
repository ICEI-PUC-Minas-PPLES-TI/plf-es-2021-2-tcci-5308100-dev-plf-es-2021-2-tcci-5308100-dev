import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ISeed from '~/database/seed.interface';
import { ExplorerStatus } from '@sec/common';
import { Explorer } from '@Models/Explorer.entity';
import faker from '@faker-js/faker';

export class ExplorersSeed implements ISeed {
  constructor(
    @InjectRepository(Explorer)
    private readonly explorerRepository: Repository<Explorer>,
  ) {}

  async seed() {
    const explorers: Explorer[] = [];

    for (let index = 0; index < 100; index++) {
      explorers.push(
        await this.explorerRepository.create({
          nickname: faker.name.findName().toLowerCase(),
          email: faker.internet.email().toLowerCase(),
          name: faker.name.findName(),
          profile: 3 as any,
          status: ExplorerStatus.ACTIVE,

          biography: faker.lorem.paragraph(1).slice(0, 30),
          favoriteProduct: faker.lorem.paragraph(1).slice(0, 10),
          instagram: faker.internet.userName(),
          tikTok: faker.internet.userName(),
          twitter: faker.internet.userName(),
          facebook: faker.internet.userName(),
          linkedIn: faker.internet.userName(),
        }),
      );
    }

    await this.explorerRepository.save(explorers);
  }
}
