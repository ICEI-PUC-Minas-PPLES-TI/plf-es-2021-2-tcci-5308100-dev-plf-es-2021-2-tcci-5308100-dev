import { Controller, UseGuards, Body, Req } from '@nestjs/common';
import { JwtAuthGuard } from '~/authentication/jwt-auth.guard';
import { UtilsService } from '~/utils/utils.service';
import { AdministratorService } from './administrator.service';

@Controller('administrator')
@UseGuards(JwtAuthGuard)
export class AdministratorController {
  constructor(
    private readonly administratorService: AdministratorService,
    private readonly utilsService: UtilsService,
  ) {}
}
