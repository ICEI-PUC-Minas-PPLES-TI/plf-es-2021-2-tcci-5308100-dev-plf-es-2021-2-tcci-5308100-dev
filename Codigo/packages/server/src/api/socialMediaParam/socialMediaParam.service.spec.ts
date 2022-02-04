import { Test, TestingModule } from '@nestjs/testing';
import { SocialMediaParamService } from './socialMediaParam.service';

describe('SocialMediaParamService', () => {
  let service: SocialMediaParamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocialMediaParamService],
    }).compile();

    service = module.get<SocialMediaParamService>(SocialMediaParamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
