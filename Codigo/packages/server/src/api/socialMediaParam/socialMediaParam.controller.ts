import { SocialMediaParam } from '@Models/SocialMediaParam.entity';
import {
  Controller,
  UseGuards,
  Body,
  Req,
  Query,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  CreateSocialMediaParamDTO,
  createSocialMediaParamValidator,
  GetAllSocialMediaParamsParams,
  GetAllSocialMediaParamsPayload,
  GetSocialMediaParamPayload,
  UpdateSocialMediaParamDTO,
  updateSocialMediaParamValidator,
} from '@sec/common';
import { In, SelectQueryBuilder } from 'typeorm';
import { JwtAuthGuard } from '~/authentication/jwt-auth.guard';
import { UtilsService } from '~/utils/utils.service';
import { SocialMediaParamService } from './socialMediaParam.service';

@Controller('social-media-param')
export class SocialMediaParamController {
  constructor(
    private readonly socialMediaParamService: SocialMediaParamService,
    private readonly utilsService: UtilsService,
  ) {}

  @Get()
  async getAllSocialMediaParams(
    @Query() queries: GetAllSocialMediaParamsParams,
  ) {
    const socialMediaParams = await this.socialMediaParamService.find({
      join: {
        alias: 'socialMediaParams',
        leftJoin: { socialMedias: 'socialMediaParams.socialMedias' },
      },
      where: (query: SelectQueryBuilder<SocialMediaParam>) => {
        const defaultQuery = query.where({
          ...(queries.status ? { status: In(queries.status) } : undefined),
          ...(queries.type ? { type: In(queries.type) } : undefined),
          ...(queries.onlyApproveAll === true
            ? { approveAll: true }
            : undefined),
        });

        if (!!queries.socialMedias)
          defaultQuery.andWhere(
            `socialMedias.name IN (${queries.socialMedias
              .map((socialMedia) => `'${socialMedia}'`)
              .join(',')})`,
          );
      },
      relations: ['socialMedias'],
    });

    return this.utilsService.apiResponse<GetAllSocialMediaParamsPayload>({
      status: !!socialMediaParams ? 'SUCCESS' : 'FAIL',
      message: 'Lista com todos os parâmetros de rede social cadastrados.',
      payload: { socialMediaParams: socialMediaParams },
    });
  }

  @Get(':id')
  async getSocialMediaParam(@Param('id') id: string) {
    if (!Number(id)) return this.utilsService.apiResponseInvalidBody(null);

    const socialMediaParam =
      await this.socialMediaParamService.findOneByIdWithRelations(+id, [
        'socialMedias',
      ]);

    return this.utilsService.apiResponse<GetSocialMediaParamPayload>({
      status: !!socialMediaParam ? 'SUCCESS' : 'FAIL',
      message: 'Detalhes do parâmetro de rede social.',
      payload: { socialMediaParam: socialMediaParam },
    });
  }

  @Post()
  async createSocialMediaParam(@Body() body: CreateSocialMediaParamDTO) {
    const { success, dto, error } = await createSocialMediaParamValidator(body);

    if (!success) return this.utilsService.apiResponseInvalidBody(error);

    const socialMediaParam = await this.socialMediaParamService.createAndSave(
      dto,
    );

    return this.utilsService.apiResponseSuccessOrFail<GetSocialMediaParamPayload>(
      {
        success: !!socialMediaParam,
        onSuccess: {
          message: 'O novo parâmetro de rede social foi cadastrado.',
          payload: { socialMediaParam },
        },
        onFail: {
          message: 'Ocorreu um erro ao cadastrar o parâmetro de rede social.',
        },
      },
    );
  }

  @Put()
  async updateSocialMediaParam(@Body() body: UpdateSocialMediaParamDTO) {
    const { success, dto, error } = await updateSocialMediaParamValidator(body);

    if (!success) return this.utilsService.apiResponseInvalidBody(error);

    const socialMediaParam = await this.socialMediaParamService.updateById(
      body.id,
      dto,
    );

    return this.utilsService.apiResponseSuccessOrFail<GetSocialMediaParamPayload>(
      {
        success: !!socialMediaParam,
        onSuccess: {
          message: 'O parâmetro de rede social foi atualizado.',
          payload: { socialMediaParam },
        },
        onFail: {
          message: 'Ocorreu um erro ao atualizar o parâmetro de rede social.',
        },
      },
    );
  }
}
