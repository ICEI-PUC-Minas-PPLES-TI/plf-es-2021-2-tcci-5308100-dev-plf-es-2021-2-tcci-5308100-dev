import {
  Controller,
  UseGuards,
  Body,
  Req,
  Post,
  Get,
  Query,
  Param,
} from '@nestjs/common';
import {
  AcceptChallengeDTO,
  AcceptChallengePayload,
  acceptChallengeValidator,
  CreateChallengePayload,
  GetAllChallengesAcceptedParams,
  GetAllChallengesAcceptedPayload,
  GetChallengeAcceptedPayload,
  SendChallengeResponseDTO,
  SendChallengeResponsePayload,
  sendChallengeResponseValidator,
  UserType,
} from '@sec/common';
import { In } from 'typeorm';
import { JwtAuthGuard } from '~/authentication/jwt-auth.guard';
import { Roles } from '~/authentication/role.guard';
import { RequestWithUser } from '~/authentication/roles.guard';
import { UtilsService } from '~/utils/utils.service';
import { ChallengeAcceptedResponseService } from '../challenge-accepted-response/challenge-accepted-response.service';
import { ChallengeAcceptedService } from './challenge-accepted.service';

@Controller('challenge-accepted')
export class ChallengeAcceptedController {
  constructor(
    private readonly challengeAcceptedService: ChallengeAcceptedService,
    private readonly utilsService: UtilsService,
  ) {}

  @Post('/accept-challenge')
  @Roles([
    UserType.SUPER_ADMINISTRATOR,
    UserType.ADMINISTRATOR,
    UserType.EXPLORER,
  ])
  async acceptChallenge(
    @Body() body: AcceptChallengeDTO,
    @Req() request: RequestWithUser,
  ) {
    const { success, dto, error } = await acceptChallengeValidator(body);

    if (!success) return this.utilsService.apiResponseInvalidBody(error);

    const { user } = request;

    const challengeAccepted =
      await this.challengeAcceptedService.acceptChallenge({
        ...dto,
        explorerId: user.id,
      });

    return this.utilsService.apiResponseSuccessOrFail<AcceptChallengePayload>({
      success: !!challengeAccepted,
      onSuccess: {
        message: 'Resposta enviada! Agora é só aguardar. :)',
        payload: { challengeAccepted },
      },
      onFail: {
        message: 'Erro ao enviar a resposta. Por favor, tente novamente. :(',
      },
    });
  }

  @Post('/send-response')
  @Roles([
    UserType.SUPER_ADMINISTRATOR,
    UserType.ADMINISTRATOR,
    UserType.EXPLORER,
  ])
  async sendChallengeResponse(
    @Body() body: SendChallengeResponseDTO,
    @Req() request: RequestWithUser,
  ) {
    const { success, dto, error } = await sendChallengeResponseValidator(body);

    if (!success) return this.utilsService.apiResponseInvalidBody(error);

    const { user } = request;

    const challengeAccepted =
      await this.challengeAcceptedService.sendChallengeResponse({
        ...dto,
        explorerId: user.id,
      });

    return this.utilsService.apiResponseSuccessOrFail<SendChallengeResponsePayload>(
      {
        success: !!challengeAccepted,
        onSuccess: {
          message: 'Resposta enviada! Agora é só aguardar. :)',
          payload: { challengeAccepted },
        },
        onFail: {
          message: 'Erro ao enviar a resposta. Por favor, tente novamente. :(',
        },
      },
    );
  }

  @Get()
  @Roles([
    UserType.SUPER_ADMINISTRATOR,
    UserType.ADMINISTRATOR,
    UserType.EXPLORER,
  ])
  async getAllChallengesAccepted(
    @Query() queries: GetAllChallengesAcceptedParams,
    @Req() request: RequestWithUser,
  ) {
    const { user } = request;

    const challengesAccepted = await this.challengeAcceptedService.find({
      where: [
        {
          ...(queries.status ? { status: In(queries.status) } : undefined),
          explorer: null,
        },
        {
          ...(queries.status ? { status: In(queries.status) } : undefined),
          explorer: user.id,
        },
      ],
      relations: ['challenge', 'challenge.recompense'],
    });

    return this.utilsService.apiResponse<GetAllChallengesAcceptedPayload>({
      status: !!challengesAccepted ? 'SUCCESS' : 'FAIL',
      message: 'Lista com todos os desafios cadastrados.',
      payload: { challengesAccepted },
    });
  }

  @Get()
  @Roles([
    UserType.SUPER_ADMINISTRATOR,
    UserType.ADMINISTRATOR,
    UserType.EXPLORER,
  ])
  async getChallengeAccepted(@Param('id') id: string) {
    if (!Number(id)) return this.utilsService.apiResponseInvalidBody(null);

    const challengeAccepted =
      await this.challengeAcceptedService.findOneByIdWithRelations(+id, [
        'challenge',
        'challenge.recompense',
      ]);

    return this.utilsService.apiResponse<GetChallengeAcceptedPayload>({
      status: !!challengeAccepted ? 'SUCCESS' : 'FAIL',
      message: 'Detalhes do desafio.',
      payload: { challengeAccepted: challengeAccepted },
    });
  }
}
