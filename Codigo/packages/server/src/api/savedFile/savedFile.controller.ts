import { Controller, UseGuards, Body, Req } from '@nestjs/common';
import { JwtAuthGuard } from '~/authentication/jwt-auth.guard';
import { UtilsService } from '~/utils/utils.service';
import { SavedFileService } from './savedFile.service';

@Controller('savedFile')
@UseGuards(JwtAuthGuard)
export class SavedFileController {
  constructor(
    private readonly savedFileService: SavedFileService,
    private readonly utilsService: UtilsService,
  ) {}
}
