import { Test, TestingModule } from '@nestjs/testing';
import { ChallengeAcceptedService } from './challenge-accepted.service';

describe('ChallengeAcceptedService', () => {
  let service: ChallengeAcceptedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChallengeAcceptedService],
    }).compile();

    service = module.get<ChallengeAcceptedService>(ChallengeAcceptedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
