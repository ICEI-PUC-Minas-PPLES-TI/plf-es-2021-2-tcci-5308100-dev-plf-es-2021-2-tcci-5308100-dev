import { Controller, UseGuards, Body, Req } from '@nestjs/common';
import { JwtAuthGuard } from '~/authentication/jwt-auth.guard';
import { UtilsService } from '~/utils/utils.service';
import { ChallengeAcceptedResponseService } from './challenge-accepted-response.service';

@Controller('challengeAcceptedResponse')
@UseGuards(JwtAuthGuard)
export class ChallengeAcceptedResponseController {
  constructor(
    private readonly challengeAcceptedResponseService: ChallengeAcceptedResponseService,
    private readonly utilsService: UtilsService,
  ) {}
}
