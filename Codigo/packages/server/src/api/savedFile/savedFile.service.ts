import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '~/database/BaseService.abstract';
import { SavedFile } from '@Models/SavedFile.entity';

@Injectable()
export class SavedFileService extends BaseService<SavedFile> {
  constructor(
    @InjectRepository(SavedFile)
    private readonly savedFileRepository: Repository<SavedFile>,
  ) {
    super(savedFileRepository, []);
    this.savedFileRepository = savedFileRepository;
  }
}
