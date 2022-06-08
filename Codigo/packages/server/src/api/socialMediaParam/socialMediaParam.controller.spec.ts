import { Test, TestingModule } from '@nestjs/testing';
import { SocialMediaParamController } from './socialMediaParam.controller';

describe('SocialMediaParamController', () => {
  let controller: SocialMediaParamController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SocialMediaParamController],
    }).compile();

    controller = module.get<SocialMediaParamController>(
      SocialMediaParamController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
