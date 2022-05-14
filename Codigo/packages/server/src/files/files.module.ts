import { Module } from '@nestjs/common';
import { FilesService } from './aws-s3.service';

@Module({
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
