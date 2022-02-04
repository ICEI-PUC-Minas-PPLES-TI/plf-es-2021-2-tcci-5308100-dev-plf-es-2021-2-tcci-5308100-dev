import { Controller, UseGuards, Body, Req } from '@nestjs/common';
import { JwtAuthGuard } from '~/authentication/jwt-auth.guard';
import { UtilsService } from '~/utils/utils.service';
import { RecompenseService } from './recompense.service';

@Controller('recompense')
@UseGuards(JwtAuthGuard)
export class RecompenseController {
  constructor(
    private readonly recompenseService: RecompenseService,
    private readonly utilsService: UtilsService,
  ) {}
}
