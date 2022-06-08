import { Test, TestingModule } from '@nestjs/testing';
import { ChallengeAcceptedResponseService } from './challenge-accepted-response.service';

describe('ChallengeAcceptedResponseService', () => {
  let service: ChallengeAcceptedResponseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChallengeAcceptedResponseService],
    }).compile();

    service = module.get<ChallengeAcceptedResponseService>(
      ChallengeAcceptedResponseService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
