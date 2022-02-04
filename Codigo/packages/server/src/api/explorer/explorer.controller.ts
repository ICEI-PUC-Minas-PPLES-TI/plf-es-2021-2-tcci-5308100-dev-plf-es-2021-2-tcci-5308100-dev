import { Controller, UseGuards, Body, Req } from '@nestjs/common';
import { JwtAuthGuard } from '~/authentication/jwt-auth.guard';
import { UtilsService } from '~/utils/utils.service';
import { ExplorerService } from './explorer.service';

@Controller('explorer')
@UseGuards(JwtAuthGuard)
export class ExplorerController {
  constructor(
    private readonly explorerService: ExplorerService,
    private readonly utilsService: UtilsService,
  ) {}
}
