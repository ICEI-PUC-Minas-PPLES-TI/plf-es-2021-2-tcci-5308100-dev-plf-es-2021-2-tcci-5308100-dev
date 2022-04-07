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
} from '@sec/common';
import { In } from 'typeorm';
import { PublicRoute } from '~/utils/public-route.decorator';
import { ShopifyService } from '~/shopify/shopify.service';
import { AuthenticationService } from '~/authentication/authentication.service';
import { UserAccessService } from '../user-access/user-access.service';

@Controller('explorer')
export class ExplorerController {
  constructor(
    private readonly explorerService: ExplorerService,
    private readonly utilsService: UtilsService,
    private readonly shopifyService: ShopifyService,
    private readonly authenticationService: AuthenticationService,
    private readonly userAccessService: UserAccessService,
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
        message: 'Erro temporário. Por favor, tente novamente.',
      });
    } else if (
      [
        ExplorerStatus.BANNED,
        ExplorerStatus.INACTIVE,
        ExplorerStatus.UNDER_REVIEW,
      ].includes(explorer.status)
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

  @Get()
  async getAllExplorers(@Query() queries: GetAllExplorersParams) {
    const explorers = await this.explorerService.find({
      where: {
        ...(queries.status ? { status: In(queries.status) } : undefined),
      },
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
}
