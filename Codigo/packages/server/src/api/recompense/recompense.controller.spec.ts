import { Test, TestingModule } from '@nestjs/testing';
import { RecompenseController } from './recompense.controller';

describe('RecompenseController', () => {
  let controller: RecompenseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecompenseController],
    }).compile();

    controller = module.get<RecompenseController>(RecompenseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
