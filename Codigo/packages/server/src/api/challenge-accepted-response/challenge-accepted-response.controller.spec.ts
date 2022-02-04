import { Test, TestingModule } from '@nestjs/testing';
import { ChallengeAcceptedResponseController } from './challenge-accepted-response.controller';

describe('ChallengeAcceptedResponseController', () => {
  let controller: ChallengeAcceptedResponseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChallengeAcceptedResponseController],
    }).compile();

    controller = module.get<ChallengeAcceptedResponseController>(ChallengeAcceptedResponseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
