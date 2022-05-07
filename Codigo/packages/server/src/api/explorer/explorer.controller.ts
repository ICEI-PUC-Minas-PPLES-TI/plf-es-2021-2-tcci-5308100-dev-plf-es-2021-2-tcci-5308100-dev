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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { JwtAuthGuard } from '~/authentication/jwt-auth.guard';
import { UtilsService } from '~/utils/utils.service';
import { ExplorerService } from './explorer.service';
import {
  GetAllExplorersParams,
  GetAllExplorersPayload,
  GetExplorerPayload,
  CreateExplorerDTO,
  createExplorerValidator,
  UpdateExplorerDTO,
  updateExplorerValidator,
  AuthenticationPayload,
  Token,
  UserType,
  ExplorerStatus,
  ActiveExplorersParams,
  ActiveExplorersPayload,
  BanExplorersParams,
  BanExplorersPayload,
  UpdateExplorerProfileDTO,
  updateExplorerProfileValidator,
  GetAvailableExplorersPayload,
} from '@sec/common';
import { In } from 'typeorm';
import { PublicRoute } from '~/utils/public-route.decorator';
import { ShopifyService } from '~/shopify/shopify.service';
import { AuthenticationService } from '~/authentication/authentication.service';
import { UserAccessService } from '../user-access/user-access.service';
import { Roles } from '~/authentication/role.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { EmailService } from '~/email/email.service';

@Controller('explorer')
export class ExplorerController {
  constructor(
    private readonly explorerService: ExplorerService,
    private readonly utilsService: UtilsService,
    private readonly shopifyService: ShopifyService,
    private readonly authenticationService: AuthenticationService,
    private readonly userAccessService: UserAccessService,
    private readonly emailService: EmailService,
  ) {}

  @PublicRoute()
  @Post('login')
  async login(
    @Body()
    {
      email,
      password,
      name,
    }: {
      email: string;
      password: string;
      name?: string;
    },
  ) {
    const explorer = await this.explorerService.findOne({
      where: { email: email, profile: { type: UserType.EXPLORER } },
      relations: ['profile'],
    });

    const data = await this.shopifyService.explorerLogin({ email, password });

    const explorerStatusMessage: {
      [key in ExplorerStatus | 'CREATING']: string;
    } = {
      ACTIVE: 'Login realizado com sucesso.',
      BANNED:
        'Usuário bloqueado. Sentimos muito, mas não será possível realizar o login.',
      INACTIVE:
        'Usuário inativo. Sentimos muito, mas não será possível realizar o login.',
      UNDER_REVIEW:
        'Ainda estamos analisando a sua solicitação. Por favor, aguarde mais um pouco.',
      CREATING:
        'Solicitação registrada. Iremos analisar a sua solicitação o mais rápido possível.',
    };

    if ((!explorer && !data) || (!explorer && data && !name)) {
      return this.utilsService.apiResponseFail({
        message:
          'E-mail e/ou senha inválidos. Por favor, confira as credenciais e tente novamente.',
      });
    } else if (!explorer && data) {
      await this.explorerService.saveNewExplorer({
        email,
        name: name,
      });

      return this.utilsService.apiResponseWarning({
        message: explorerStatusMessage['CREATING'],
      });
    } else if (explorer && !data) {
      return this.utilsService.apiResponseFail({
        message:
          'E-mail e/ou senha inválidos. Por favor, confira as credenciais e tente novamente.',
      });
    } else if (explorer.status === ExplorerStatus.UNDER_REVIEW) {
      return this.utilsService.apiResponseWarning({
        message: explorerStatusMessage['UNDER_REVIEW'],
      });
    } else if (
      [ExplorerStatus.BANNED, ExplorerStatus.INACTIVE].includes(explorer.status)
    ) {
      return this.utilsService.apiResponseFail({
        message: explorerStatusMessage[explorer.status],
      });
    } else {
      const payload = await this.explorerService.createExplorerToken(
        explorer,
        data.token,
      );

      return this.utilsService.apiResponseSuccess<AuthenticationPayload>({
        message: explorerStatusMessage['ACTIVE'],
        payload: payload,
      });
    }
  }

  @Get('profile/:id')
  @Roles('*')
  async getExplorerProfile(@Param('id') id: string) {
    if (!Number(id)) return this.utilsService.apiResponseInvalidBody(null);

    const explorer = await this.explorerService.findOneByIdWithRelations(+id, [
      'avatar',
      'acceptedChallenges',
      'acceptedChallenges.challenge',
      'acceptedChallenges.challenge.recompense',
      'acceptedChallenges.challenge.cover',
    ]);

    return this.utilsService.apiResponse<GetExplorerPayload>({
      status: !!explorer ? 'SUCCESS' : 'FAIL',
      message: 'Detalhes do explorador.',
      payload: { explorer: explorer },
    });
  }

  @Put('profile')
  @Roles([UserType.EXPLORER])
  @UseInterceptors(FileInterceptor('newAvatar'))
  async updateExplorerProfile(
    @Body() body: { object: string },
    @UploadedFile() newAvatar: Express.Multer.File,
  ) {
    const data: UpdateExplorerProfileDTO = JSON.parse(body.object);
    const { success, dto, error } = await updateExplorerProfileValidator(data);

    if (!success) return this.utilsService.apiResponseInvalidBody(error);

    const explorer = await this.explorerService.updateExplorerProfile(data.id, {
      ...dto,
      newAvatar,
    });

    return this.utilsService.apiResponseSuccessOrFail<GetExplorerPayload>({
      success: !!explorer,
      onSuccess: {
        message: 'O perfil foi atualizado.',
        payload: { explorer },
      },
      onFail: {
        message:
          'Ocorreu um erro ao atualizar o perfil. Por favor, tente novamente.',
      },
    });
  }

  @Get('available')
  @Roles('*')
  public async getAvailableExplorers() {
    try {
      const explorers = await this.explorerService.getAvailableExplorers();

      return this.utilsService.apiResponseSuccess<GetAvailableExplorersPayload>(
        {
          message: 'Lista de exploradores.',
          payload: { explorers },
        },
      );
    } catch (error) {
      console.log(error);
      return this.utilsService.apiResponseFail({
        message: 'Erro ao buscar exploradores.',
      });
    }
  }

  @Get()
  async getAllExplorers(@Query() queries: GetAllExplorersParams) {
    const explorers = await this.explorerService.find({
      where: {
        ...(queries.status ? { status: In(queries.status) } : undefined),
      },
      relations: ['avatar'],
    });

    return this.utilsService.apiResponse<GetAllExplorersPayload>({
      status: !!explorers ? 'SUCCESS' : 'FAIL',
      message: 'Lista com todos os exploradores cadastrados.',
      payload: { explorers: explorers },
    });
  }

  @Get(':id')
  async getExplorer(@Param('id') id: string) {
    if (!Number(id)) return this.utilsService.apiResponseInvalidBody(null);

    const explorer = await this.explorerService.findOneById(+id);

    return this.utilsService.apiResponse<GetExplorerPayload>({
      status: !!explorer ? 'SUCCESS' : 'FAIL',
      message: 'Detalhes do explorador.',
      payload: { explorer: explorer },
    });
  }

  @Post()
  async createExplorer(@Body() body: CreateExplorerDTO) {
    const { success, dto, error } = await createExplorerValidator(body);

    if (!success) return this.utilsService.apiResponseInvalidBody(error);

    const explorer = await this.explorerService.createAndSave(dto);

    return this.utilsService.apiResponseSuccessOrFail<GetExplorerPayload>({
      success: !!explorer,
      onSuccess: {
        message: 'O novo explorador foi cadastrado.',
        payload: { explorer },
      },
      onFail: { message: 'Ocorreu um erro ao cadastrar o explorador.' },
    });
  }

  @Put()
  async updateExplorer(@Body() body: UpdateExplorerDTO) {
    const { success, dto, error } = await updateExplorerValidator(body);

    if (!success) return this.utilsService.apiResponseInvalidBody(error);

    const explorer = await this.explorerService.updateById(body.id, dto);

    return this.utilsService.apiResponseSuccessOrFail<GetExplorerPayload>({
      success: !!explorer,
      onSuccess: {
        message: 'O explorador foi atualizado.',
        payload: { explorer },
      },
      onFail: { message: 'Ocorreu um erro ao atualizar o explorador.' },
    });
  }

  @Put('active-explorers')
  async activeExplorers(@Body() dto: ActiveExplorersParams) {
    // TODO: Send email on active explorer
    try {
      await this.explorerService
        .getRepository()
        .update({ id: In(dto.explorerIds) }, { status: ExplorerStatus.ACTIVE });

      const explorers = await this.explorerService.findAll();

      return this.utilsService.apiResponseSuccess<ActiveExplorersPayload>({
        message: 'Exploradores ativados.',
        payload: { explorers: explorers },
      });
    } catch (error) {
      return this.utilsService.apiResponseFail({
        message: 'Erro ao ativar os exploradores.',
      });
    }
  }

  @Put('ban-explorers')
  async banExplorers(@Body() dto: BanExplorersParams) {
    try {
      await this.explorerService
        .getRepository()
        .update({ id: In(dto.explorerIds) }, { status: ExplorerStatus.BANNED });

      const explorers = await this.explorerService.findAll();

      return this.utilsService.apiResponseSuccess<BanExplorersPayload>({
        message: 'Exploradores banidos.',
        payload: { explorers: explorers },
      });
    } catch (error) {
      return this.utilsService.apiResponseFail({
        message: 'Erro ao banir os exploradores.',
      });
    }
  }

  @Post('indicate-explorer')
  @Roles('*')
  async indicateExplorer(@Body() body: { email: string }) {
    const { email } = body;
    const result = await this.emailService.indicateExplorer({ email });

    return this.utilsService.apiResponseSuccessOrFail({
      success: result,
      onSuccess: {
        message: 'Obrigado pela indicação.',
        payload: null,
      },
      onFail: {
        message:
          'Ocorreu um erro ao registrar a indicação. Por favor, tente novamente.',
      },
    });
  }
}
