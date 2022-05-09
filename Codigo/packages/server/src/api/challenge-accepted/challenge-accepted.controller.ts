import {
  Controller,
  Body,
  Req,
  Post,
  Get,
  Query,
  Param,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import {
  AcceptChallengeDTO,
  AcceptChallengePayload,
  acceptChallengeValidator,
  acceptResponseValidator,
  declineResponseValidator,
  GetAllChallengesAcceptedParams,
  GetAllChallengesAcceptedPayload,
  GetChallengeAcceptedPayload,
  GetReadOnlyChallengeAcceptedPayload,
  RedeemRecompensePayload,
  SendChallengeResponseDTO,
  SendChallengeResponsePayload,
  sendChallengeResponseValidator,
  UserType,
} from '@sec/common';
import { In } from 'typeorm';
import { Roles } from '~/authentication/role.guard';
import { RequestWithUser } from '~/authentication/roles.guard';
import { UtilsService } from '~/utils/utils.service';
import { CommentService } from '../comment/comment.service';
import { ChallengeAcceptedService } from './challenge-accepted.service';

@Controller('challenge-accepted')
export class ChallengeAcceptedController {
  constructor(
    private readonly challengeAcceptedService: ChallengeAcceptedService,
    private readonly commentService: CommentService,
    private readonly utilsService: UtilsService,
  ) {}

  @Get('/administrator')
  @Roles([UserType.SUPER_ADMINISTRATOR, UserType.ADMINISTRATOR])
  async getAllChallengesAcceptedAsAdministrator(
    @Query() queries: GetAllChallengesAcceptedParams,
  ) {
    const challengesAccepted = await this.challengeAcceptedService.find({
      where: {
        ...(queries.status ? { status: In(queries.status) } : undefined),
      },
      relations: [
        'challenge',
        'challenge.recompense',
        'challenge.cover',
        'explorer',
        'responses',
      ],
    });

    challengesAccepted.forEach((challengeAccepted) => {
      challengeAccepted.calcResponsesCount();
      challengeAccepted.responses = [];
    });

    return this.utilsService.apiResponse<GetAllChallengesAcceptedPayload>({
      status: !!challengesAccepted ? 'SUCCESS' : 'FAIL',
      message: 'Lista com todos os desafios cadastrados.',
      payload: { challengesAccepted },
    });
  }

  @Get('/administrator/:id')
  @Roles([UserType.SUPER_ADMINISTRATOR, UserType.ADMINISTRATOR])
  async getChallengeAcceptedAsAdministrator(@Param('id') id: string) {
    if (!Number(id)) return this.utilsService.apiResponseInvalidBody(null);

    const challengeAccepted = await this.challengeAcceptedService.getById(+id);

    return this.utilsService.apiResponse<GetChallengeAcceptedPayload>({
      status: !!challengeAccepted ? 'SUCCESS' : 'FAIL',
      message: 'Detalhes do desafio.',
      payload: { challengeAccepted: challengeAccepted },
    });
  }

  @Post('/accept')
  @Roles([UserType.SUPER_ADMINISTRATOR, UserType.ADMINISTRATOR])
  async acceptChallengeResponse(@Body() body: AcceptChallengeDTO) {
    const { success, dto, error } = await acceptResponseValidator(body);
    if (!success) return this.utilsService.apiResponseInvalidBody(error);

    const challengeAccepted =
      await this.challengeAcceptedService.acceptResponse({
        challengeAcceptedId: dto.challengeAcceptedId,
      });

    return this.utilsService.apiResponseSuccessOrFail<GetChallengeAcceptedPayload>(
      {
        success: !!challengeAccepted,
        onSuccess: {
          message: 'O novo status foi salvo.',
          payload: { challengeAccepted: challengeAccepted },
        },
        onFail: {
          message: 'Não foi possível alterar o status do desafio.',
        },
      },
    );
  }

  @Post('/decline')
  @Roles([UserType.SUPER_ADMINISTRATOR, UserType.ADMINISTRATOR])
  async declineChallengeResponse(@Body() body: AcceptChallengeDTO) {
    const { success, dto, error } = await declineResponseValidator(body);
    if (!success) return this.utilsService.apiResponseInvalidBody(error);

    const challengeAccepted =
      await this.challengeAcceptedService.declineResponse({
        challengeAcceptedId: dto.challengeAcceptedId,
      });

    return this.utilsService.apiResponseSuccessOrFail<GetChallengeAcceptedPayload>(
      {
        success: !!challengeAccepted,
        onSuccess: {
          message: 'O novo status foi salvo.',
          payload: { challengeAccepted: challengeAccepted },
        },
        onFail: {
          message: 'Não foi possível alterar o status do desafio.',
        },
      },
    );
  }

  @Post('/accept-challenge')
  @Roles([UserType.EXPLORER])
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'files', maxCount: 10 },
      { name: 'images', maxCount: 10 },
    ]),
  )
  async acceptChallenge(
    @Body() body: { object: string },
    @Req() request: RequestWithUser,
    @UploadedFiles()
    {
      files,
      images,
    }: { files?: Express.Multer.File[]; images?: Express.Multer.File[] },
  ) {
    const data: AcceptChallengeDTO = JSON.parse(body.object);
    const { success, dto, error } = await acceptChallengeValidator(data);

    if (!success) return this.utilsService.apiResponseInvalidBody(error);

    const { user } = request;

    const challengeAccepted =
      await this.challengeAcceptedService.acceptChallenge({
        ...dto,
        explorerId: user.id,
        files,
        images,
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
  @Roles([UserType.EXPLORER])
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'files', maxCount: 10 },
      { name: 'images', maxCount: 10 },
    ]),
  )
  async sendChallengeResponse2(
    @Body() body: { object: string },
    @Req() request: RequestWithUser,
    @UploadedFiles()
    {
      files,
      images,
    }: { files?: Express.Multer.File[]; images?: Express.Multer.File[] },
  ) {
    const data: SendChallengeResponseDTO = JSON.parse(body.object);
    const { success, dto, error } = await sendChallengeResponseValidator(data);

    if (!success) return this.utilsService.apiResponseInvalidBody(error);

    const { user } = request;

    const challengeAccepted =
      await this.challengeAcceptedService.sendChallengeResponse({
        ...dto,
        explorerId: user.id,
        files,
        images,
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
          explorer: { id: user.id },
        },
      ],
      relations: ['challenge', 'challenge.recompense', 'challenge.cover'],
    });

    return this.utilsService.apiResponse<GetAllChallengesAcceptedPayload>({
      status: !!challengesAccepted ? 'SUCCESS' : 'FAIL',
      message: 'Lista com todos os desafios cadastrados.',
      payload: { challengesAccepted },
    });
  }

  @Get('read-only/:id')
  @Roles([
    UserType.SUPER_ADMINISTRATOR,
    UserType.ADMINISTRATOR,
    UserType.EXPLORER,
  ])
  async getReadOnlyChallengeAccepted(@Param('id') id: string) {
    if (!Number(id)) return this.utilsService.apiResponseInvalidBody(null);

    const challengeAccepted = await this.challengeAcceptedService
      .getRepository()
      .createQueryBuilder('challengeAccepted')
      .leftJoinAndSelect('challengeAccepted.challenge', 'challenge')
      .leftJoinAndSelect('challenge.recompense', 'recompense')
      .leftJoinAndSelect('challenge.cover', 'cover')
      .leftJoinAndSelect('challengeAccepted.responses', 'responses')
      .leftJoinAndSelect('responses.savedFiles', 'savedFiles')
      .leftJoin(
        'challengeAccepted.responses',
        'next_responses',
        'responses.createdAt < next_responses.createdAt',
      )
      .where('next_responses.id IS NULL')
      .andWhere({ id: +id })
      .getOne();

    return this.utilsService.apiResponse<GetReadOnlyChallengeAcceptedPayload>({
      status: !!challengeAccepted ? 'SUCCESS' : 'FAIL',
      message: 'Detalhes do desafio.',
      payload: { challengeAccepted: challengeAccepted },
    });
  }

  @Get(':id')
  @Roles([
    UserType.SUPER_ADMINISTRATOR,
    UserType.ADMINISTRATOR,
    UserType.EXPLORER,
  ])
  async getChallengeAccepted(
    @Param('id') id: string,
    @Req() request: RequestWithUser,
  ) {
    if (!Number(id)) return this.utilsService.apiResponseInvalidBody(null);

    const { user } = request;

    const challengeAccepted = await this.challengeAcceptedService.findOne({
      where: { id: +id, explorer: { id: user.id } },
      relations: [
        'challenge',
        'challenge.recompense',
        'challenge.cover',
        'responses',
        'responses.savedFiles',
      ],
    });

    if (!!challengeAccepted)
      challengeAccepted.comments =
        await this.commentService.getByAcceptedChallenge(+id);

    return this.utilsService.apiResponse<GetChallengeAcceptedPayload>({
      status: !!challengeAccepted ? 'SUCCESS' : 'FAIL',
      message: 'Detalhes do desafio.',
      payload: { challengeAccepted: challengeAccepted },
    });
  }

  @Roles([UserType.EXPLORER])
  @Get('redeem-recompense/:id')
  async redeemRecompense(
    @Param('id') id: string,
    @Req() request: RequestWithUser,
  ) {
    const { user } = request;
    const recompense =
      await this.challengeAcceptedService.redeemChallengeAcceptedRecompense({
        challengeAcceptedId: +id,
        explorerId: user.id,
      });

    return this.utilsService.apiResponseSuccessOrFail<RedeemRecompensePayload>({
      success: !!recompense,
      onSuccess: {
        message: 'Instruções sobre a recompensa.',
        payload: { recompense },
      },
      onFail: {
        message: 'Não foi possível resgatar essa recompensa.',
      },
    });
  }
}
