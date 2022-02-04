import { Controller, UseGuards, Body, Req } from '@nestjs/common';
import { JwtAuthGuard } from '~/authentication/jwt-auth.guard';
import { UtilsService } from '~/utils/utils.service';
import { ChallengeService } from './challenge.service';

@Controller('challenge')
@UseGuards(JwtAuthGuard)
export class ChallengeController {
  constructor(
    private readonly challengeService: ChallengeService,
    private readonly utilsService: UtilsService,
  ) {}
}
