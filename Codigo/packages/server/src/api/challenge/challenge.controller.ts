import { ChallengeAccepted } from '@Models/ChallengeAccepted.entity';
import { Challenge } from '@Models/Challenge.entity';
import {
  Controller,
  Body,
  Req,
  Get,
  Query,
  Param,
  Put,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ChallengeStatus,
  CreateChallengeDTO,
  CreateChallengePayload,
  createChallengeValidator,
  ExplorerStatus,
  GetAllChallengesParams,
  GetAllChallengesPayload,
  GetChallengeAsExplorerPayload,
  GetChallengeBasePayload,
  GetChallengePayload,
  RecompenseStatus,
  UpdateChallengeDTO,
  UpdateChallengePayload,
  updateChallengeValidator,
  UserType,
} from '@sec/common';
import { In, Like, SelectQueryBuilder } from 'typeorm';
import { JwtAuthGuard } from '~/authentication/jwt-auth.guard';
import { Roles } from '~/authentication/role.guard';
import { RequestWithUser } from '~/authentication/roles.guard';
import { UtilsService } from '~/utils/utils.service';
import { ExplorerService } from '../explorer/explorer.service';
import { RecompenseService } from '../recompense/recompense.service';
import { ChallengeService } from './challenge.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('challenge')
export class ChallengeController {
  constructor(
    private readonly challengeService: ChallengeService,
    private readonly recompenseService: RecompenseService,
    private readonly explorerService: ExplorerService,
    private readonly utilsService: UtilsService,
  ) {}

  @Get('/explorer')
  @Roles([
    UserType.SUPER_ADMINISTRATOR,
    UserType.ADMINISTRATOR,
    UserType.EXPLORER,
  ])
  async getAllChallengesAsExplorer(@Req() request: RequestWithUser) {
    const { user } = request;

    const challenges = await this.challengeService.find({
      join: { alias: 'challenge' },
      where: (query: SelectQueryBuilder<Challenge>) => {
        query
          .where([
            {
              status: ChallengeStatus.OPEN,
              challengedExplorer: user.id,
            },
            {
              status: ChallengeStatus.OPEN,
              challengedExplorer: null,
            },
          ])
          .andWhere(
            (query) =>
              `challenge.id NOT IN ${query
                .subQuery()
                .select('challenge_accepted.challengeId')
                .from(ChallengeAccepted, 'challenge_accepted')
                .getQuery()}`,
          );
      },
      relations: ['recompense', 'cover'],
    });

    return this.utilsService.apiResponse<GetAllChallengesPayload>({
      status: !!challenges ? 'SUCCESS' : 'FAIL',
      message: 'Lista com todos os desafios cadastrados.',
      payload: { challenges: challenges },
    });
  }

  @Get('/explorer/:id')
  @Roles([
    UserType.SUPER_ADMINISTRATOR,
    UserType.ADMINISTRATOR,
    UserType.EXPLORER,
  ])
  async getChallengeAsExplorer(
    @Param('id') id: string,
    @Req() request: RequestWithUser,
  ) {
    if (!Number(id)) return this.utilsService.apiResponseInvalidBody(null);

    const challenge = await this.challengeService.findOne({
      where: [
        {
          id: +id,
          status: ChallengeStatus.OPEN,
          challengedExplorer: request.user.id,
        },
        {
          id: +id,
          status: ChallengeStatus.OPEN,
          challengedExplorer: null,
        },
      ],
      relations: ['recompense', 'cover'],
    });

    return this.utilsService.apiResponse<GetChallengeAsExplorerPayload>({
      status: !!challenge ? 'SUCCESS' : 'FAIL',
      message: !!challenge ? 'Detalhes do desafio.' : 'Desafio indisponível.',
      payload: { challenge: challenge },
    });
  }

  @Get()
  async getAllChallenges(@Query() queries: GetAllChallengesParams) {
    const challenges = await this.challengeService.findWithRelations({
      where: {
        ...(queries.status ? { status: In(queries.status) } : undefined),
        ...(queries.challengedExplorer
          ? {
              challengedExplorer: {
                name: Like(`%${queries.challengedExplorer}%`),
              },
            }
          : undefined),
        ...(queries.recompense
          ? { recompense: { name: Like(`%${queries.recompense}%`) } }
          : undefined),
      },
      relations: ['recompense', 'acceptedChallenges', 'cover'],
    });

    return this.utilsService.apiResponse<GetAllChallengesPayload>({
      status: !!challenges ? 'SUCCESS' : 'FAIL',
      message: 'Lista com todos os desafios cadastrados.',
      payload: { challenges: challenges },
    });
  }

  @Get('/base')
  async getChallengeBase() {
    const recompensesPromise = this.recompenseService.find({
      where: { status: RecompenseStatus.ACTIVE },
    });

    const explorersPromise = this.explorerService.find({
      where: { status: ExplorerStatus.ACTIVE },
    });

    const [recompenses, explorers] = await Promise.all([
      recompensesPromise,
      explorersPromise,
    ]);

    return this.utilsService.apiResponse<GetChallengeBasePayload>({
      status: 'SUCCESS',
      message: 'Dados base',
      payload: { explorers, recompenses },
    });
  }

  @Get(':id')
  async getChallenge(@Param('id') id: string) {
    if (!Number(id)) return this.utilsService.apiResponseInvalidBody(null);

    const challengePromise = this.challengeService.findOneByIdWithRelations(
      +id,
      ['recompense', 'challengedExplorer', 'cover'],
    );
    const recompensesPromise = this.recompenseService.find({
      where: { status: RecompenseStatus.ACTIVE },
    });
    const explorersPromise = this.explorerService.find({
      where: { status: ExplorerStatus.ACTIVE },
    });

    const [challenge, recompenses, explorers] = await Promise.all([
      challengePromise,
      recompensesPromise,
      explorersPromise,
    ]);

    return this.utilsService.apiResponse<GetChallengePayload>({
      status: !!challenge ? 'SUCCESS' : 'FAIL',
      message: 'Detalhes do desafio.',
      payload: { challenge, explorers, recompenses },
    });
  }

  @Post()
  @UseInterceptors(FileInterceptor('newCover'))
  async createChallenge(
    @Body() body: { object: string },
    @UploadedFile() newCover: Express.Multer.File,
  ) {
    const data: CreateChallengeDTO = JSON.parse(body.object);
    const { success, dto, error } = await createChallengeValidator(data);

    if (!success) return this.utilsService.apiResponseInvalidBody(error);

    const challenge = await this.challengeService.createAndSaveAux({
      ...dto,
      newCover,
    });

    return this.utilsService.apiResponseSuccessOrFail<CreateChallengePayload>({
      success: !!challenge,
      onSuccess: {
        message: 'O novo desafio foi cadastrado.',
        payload: { challenge },
      },
      onFail: { message: 'Ocorreu um erro ao cadastrar o desafio.' },
    });
  }

  @Put()
  @UseInterceptors(FileInterceptor('newCover'))
  async updateChallenge(
    @Body() body: { object: string },
    @UploadedFile() newCover: Express.Multer.File,
  ) {
    const data: UpdateChallengeDTO = JSON.parse(body.object);
    const { success, dto, error } = await updateChallengeValidator(data);

    if (!success) return this.utilsService.apiResponseInvalidBody(error);

    const challengeSaved = await this.challengeService.updateByIdAux(dto.id, {
      ...dto,
      newCover,
    });

    return this.utilsService.apiResponseSuccessOrFail<UpdateChallengePayload>({
      success: !!challengeSaved,
      onSuccess: {
        message: 'O desafio foi atualizado.',
        payload: {
          challenge:
            !!challengeSaved &&
            (await this.challengeService.getOneById(challengeSaved.id)),
        },
      },
      onFail: { message: 'Ocorreu um erro ao atualizar o desafio.' },
    });
  }
}
