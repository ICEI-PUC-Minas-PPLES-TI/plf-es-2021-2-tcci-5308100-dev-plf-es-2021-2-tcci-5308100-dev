import { Controller, UseGuards, Body, Req } from '@nestjs/common';
import { JwtAuthGuard } from '~/authentication/jwt-auth.guard';
import { UtilsService } from '~/utils/utils.service';
import { ChallengeAcceptedService } from './challenge-accepted.service';

@Controller('challengeAccepted')
@UseGuards(JwtAuthGuard)
export class ChallengeAcceptedController {
  constructor(
    private readonly challengeAcceptedService: ChallengeAcceptedService,
    private readonly utilsService: UtilsService,
  ) {}
}
