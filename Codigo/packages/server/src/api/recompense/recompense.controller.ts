import {
  Controller,
  UseGuards,
  Body,
  Req,
  Get,
  Query,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  CreateRecompenseDTO,
  CreateRecompensePayload,
  createRecompenseValidator,
  GetAllRecompensesParams,
  GetAllRecompensesPayload,
  GetRecompenseBasePayload,
  GetRecompensePayload,
  UpdateRecompenseDTO,
  UpdateRecompensePayload,
  updateRecompenseValidator,
} from '@sec/common';
import { In } from 'typeorm';
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

  @Get()
  async getAllRecompenses(@Query() queries: GetAllRecompensesParams) {
    const recompenses = await this.recompenseService.findWithRelations({
      where: {
        ...(queries.type ? { type: In(queries.type) } : undefined),
        ...(queries.status ? { status: In(queries.status) } : undefined),
      },
    });

    return this.utilsService.apiResponse<GetAllRecompensesPayload>({
      status: !!recompenses ? 'SUCCESS' : 'FAIL',
      message: 'Lista com todas as recompensas cadastradas.',
      payload: { recompenses: recompenses },
    });
  }

  @Get('/base')
  async getRecompenseBase() {
    return this.utilsService.apiResponse<GetRecompenseBasePayload>({
      status: 'SUCCESS',
      message: 'Dados base',
      payload: {},
    });
  }

  @Get(':id')
  async getRecompense(@Param('id') id: string) {
    if (!Number(id)) return this.utilsService.apiResponseInvalidBody(null);

    const recompense = await this.recompenseService.findOneById(+id);

    return this.utilsService.apiResponse<GetRecompensePayload>({
      status: !!recompense ? 'SUCCESS' : 'FAIL',
      message: 'Detalhes da recompensa.',
      payload: { recompense: recompense },
    });
  }

  @Post()
  async createRecompense(@Body() body: CreateRecompenseDTO) {
    const { success, dto, error } = await createRecompenseValidator(body);

    if (!success) return this.utilsService.apiResponseInvalidBody(error);

    const recompense = await this.recompenseService.createAndSave(dto);

    return this.utilsService.apiResponseSuccessOrFail<CreateRecompensePayload>({
      success: !!recompense,
      onSuccess: {
        message: 'A nova recompensa foi cadastrada.',
        payload: { recompense },
      },
      onFail: { message: 'Ocorreu um erro ao cadastrar a recompensa.' },
    });
  }

  @Put()
  async updateRecompense(@Body() body: UpdateRecompenseDTO) {
    const { success, dto, error } = await updateRecompenseValidator(body);

    if (!success) return this.utilsService.apiResponseInvalidBody(error);

    const recompense = await this.recompenseService.updateById(body.id, dto);

    return this.utilsService.apiResponseSuccessOrFail<UpdateRecompensePayload>({
      success: !!recompense,
      onSuccess: {
        message: 'A recompensa foi atualizada.',
        payload: { recompense },
      },
      onFail: { message: 'Ocorreu um erro ao atualizar a recompensa.' },
    });
  }
}
