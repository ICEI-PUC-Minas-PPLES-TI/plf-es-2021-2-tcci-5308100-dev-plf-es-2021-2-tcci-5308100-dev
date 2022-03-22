import {
  Controller,
  UseGuards,
  Body,
  Req,
  Get,
  Query,
  Param,
  Put,
  Post,
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
import { In, Like } from 'typeorm';
import { JwtAuthGuard } from '~/authentication/jwt-auth.guard';
import { Roles } from '~/authentication/role.guard';
import { RequestWithUser } from '~/authentication/roles.guard';
import { UtilsService } from '~/utils/utils.service';
import { ExplorerService } from '../explorer/explorer.service';
import { RecompenseService } from '../recompense/recompense.service';
import { ChallengeService } from './challenge.service';

@Controller('challenge')
export class ChallengeController {
  constructor(
    private readonly challengeService: ChallengeService,
    private readonly recompenseService: RecompenseService,
    private readonly explorerService: ExplorerService,
    private readonly utilsService: UtilsService,
  ) {}

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
      relations: ['recompense', 'acceptedChallenges'],
    });

    return this.utilsService.apiResponse<GetAllChallengesPayload>({
      status: !!challenges ? 'SUCCESS' : 'FAIL',
      message: 'Lista com todos os desafios cadastrados.',
      payload: { challenges: challenges },
    });
  }

  @Get('/base')
  async getChallengeBase() {
    const recompenses = await this.recompenseService.find({
      where: { status: RecompenseStatus.ACTIVE },
    });

    const explorers = await this.explorerService.find({
      where: { status: ExplorerStatus.ACTIVE },
    });

    return this.utilsService.apiResponse<GetChallengeBasePayload>({
      status: 'SUCCESS',
      message: 'Dados base',
      payload: { explorers, recompenses },
    });
  }

  @Get(':id')
  async getChallenge(@Param('id') id: string) {
    if (!Number(id)) return this.utilsService.apiResponseInvalidBody(null);

    const challenge = await this.challengeService.findOneByIdWithRelations(
      +id,
      ['recompense', 'challengedExplorer'],
    );
    const recompenses = await this.recompenseService.find({
      where: { status: RecompenseStatus.ACTIVE },
    });
    const explorers = await this.explorerService.find({
      where: { status: ExplorerStatus.ACTIVE },
    });

    return this.utilsService.apiResponse<GetChallengePayload>({
      status: !!challenge ? 'SUCCESS' : 'FAIL',
      message: 'Detalhes do desafio.',
      payload: { challenge: challenge, explorers, recompenses },
    });
  }

  @Post()
  async createChallenge(@Body() body: CreateChallengeDTO) {
    const { success, dto, error } = await createChallengeValidator(body);

    if (!success) return this.utilsService.apiResponseInvalidBody(error);

    const challenge = await this.challengeService.createAndSave(dto);

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
  async updateChallenge(@Body() body: UpdateChallengeDTO) {
    const { success, dto, error } = await updateChallengeValidator(body);

    if (!success) return this.utilsService.apiResponseInvalidBody(error);

    const challenge = await this.challengeService.updateById(body.id, dto);

    if (!!challenge) {
      await challenge.challengedExplorer;
      await challenge.recompense;
    }

    return this.utilsService.apiResponseSuccessOrFail<UpdateChallengePayload>({
      success: !!challenge,
      onSuccess: {
        message: 'O desafio foi atualizado.',
        payload: { challenge },
      },
      onFail: { message: 'Ocorreu um erro ao atualizar o desafio.' },
    });
  }

  //Explorer
  @Get('/explorer')
  @Roles([
    UserType.SUPER_ADMINISTRATOR,
    UserType.ADMINISTRATOR,
    UserType.EXPLORER,
  ])
  async getAllChallengesAsExplorer(@Req() request: RequestWithUser) {
    const { user } = request;

    const challenges = await this.challengeService.findWithRelations({
      where: [
        {
          status: ChallengeStatus.OPEN,
          challengedExplorer: user.id,
        },
        {
          status: ChallengeStatus.OPEN,
          challengedExplorer: null,
        },
      ],
      relations: ['recompense'],
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
      relations: ['recompense'],
    });

    return this.utilsService.apiResponse<GetChallengeAsExplorerPayload>({
      status: !!challenge ? 'SUCCESS' : 'FAIL',
      message: !!challenge ? 'Detalhes do desafio.' : 'Desafio indisponível.',
      payload: { challenge: challenge },
    });
  }
}
