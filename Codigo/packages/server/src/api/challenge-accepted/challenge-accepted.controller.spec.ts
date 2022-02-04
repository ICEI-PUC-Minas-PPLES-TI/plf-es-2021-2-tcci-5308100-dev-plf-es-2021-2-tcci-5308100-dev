import { Test, TestingModule } from '@nestjs/testing';
import { ChallengeAcceptedController } from './challenge-accepted.controller';

describe('ChallengeAcceptedController', () => {
  let controller: ChallengeAcceptedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChallengeAcceptedController],
    }).compile();

    controller = module.get<ChallengeAcceptedController>(ChallengeAcceptedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
