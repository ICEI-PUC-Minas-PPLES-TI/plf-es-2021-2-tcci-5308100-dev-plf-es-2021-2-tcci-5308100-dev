import { Test, TestingModule } from '@nestjs/testing';
import { RecompenseService } from './recompense.service';

describe('RecompenseService', () => {
  let service: RecompenseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecompenseService],
    }).compile();

    service = module.get<RecompenseService>(RecompenseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
