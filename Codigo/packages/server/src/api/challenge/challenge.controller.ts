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
  CreateChallengeDTO,
  createChallengeValidator,
  GetAllChallengesParams,
  GetAllChallengesPayload,
  GetChallengePayload,
  UpdateChallengeDTO,
  updateChallengeValidator,
} from '@sec/common';
import { In, Like } from 'typeorm';
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

  @Get()
  async getAllChallenges(@Query() queries: GetAllChallengesParams) {
    const challenges = await this.challengeService.find({
      where: {
        ...(queries.status ? { status: In(queries.status) } : undefined),
        ...(queries.challengedExplorer
          ? { challengedExplorer: { name: Like(queries.challengedExplorer) } }
          : undefined),
        ...(queries.recompense
          ? { recompense: { name: Like(queries.recompense) } }
          : undefined),
      },
    });

    return this.utilsService.apiResponse<GetAllChallengesPayload>({
      status: !!challenges ? 'SUCCESS' : 'FAIL',
      message: 'Lista com todos os desafios cadastrados.',
      payload: { challenges: challenges },
    });
  }

  @Get(':id')
  async getChallenge(@Param('id') id: string) {
    if (!Number(id)) return this.utilsService.apiResponseInvalidBody(null);

    const challenge = await this.challengeService.findOneById(+id);

    return this.utilsService.apiResponse<GetChallengePayload>({
      status: !!challenge ? 'SUCCESS' : 'FAIL',
      message: 'Detalhes do desafio.',
      payload: { challenge: challenge },
    });
  }

  @Post()
  async createChallenge(@Body() body: CreateChallengeDTO) {
    const { success, dto, error } = await createChallengeValidator(body);

    if (!success) return this.utilsService.apiResponseInvalidBody(error);

    const challenge = await this.challengeService.createAndSave(dto);

    return this.utilsService.apiResponseSuccessOrFail<GetChallengePayload>({
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

    return this.utilsService.apiResponseSuccessOrFail<GetChallengePayload>({
      success: !!challenge,
      onSuccess: {
        message: 'O desafio foi atualizado.',
        payload: { challenge },
      },
      onFail: { message: 'Ocorreu um erro ao atualizar o desafio.' },
    });
  }
}
