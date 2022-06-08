import { Test, TestingModule } from '@nestjs/testing';
import { SavedFileService } from './savedFile.service';

describe('SavedFileService', () => {
  let service: SavedFileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SavedFileService],
    }).compile();

    service = module.get<SavedFileService>(SavedFileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
