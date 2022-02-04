import { Test, TestingModule } from '@nestjs/testing';
import { SavedFileController } from './savedFile.controller';

describe('SavedFileController', () => {
  let controller: SavedFileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SavedFileController],
    }).compile();

    controller = module.get<SavedFileController>(SavedFileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
