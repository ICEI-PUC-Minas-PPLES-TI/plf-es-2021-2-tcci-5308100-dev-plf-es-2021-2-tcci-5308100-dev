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

@Controller('explorer')
export class ExplorerController {
  constructor(
    private readonly explorerService: ExplorerService,
    private readonly utilsService: UtilsService,
    private readonly shopifyService: ShopifyService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  @PublicRoute()
  @Post('login')
  async login(
    @Body() { email, password }: { email: string; password: string },
  ) {
    const explorer = await this.explorerService.findOne({
      where: { email: email, profile: { type: UserType.EXPLORER } },
      relations: ['profile'],
    });

    const data =
      explorer === undefined
        ? null
        : await this.shopifyService.explorerLogin({ email, password });

    if (!explorer || !data) {
      return this.utilsService.apiResponseFail({
        message:
          'E-mail e/ou senha inválidos. Por favor, confira as credenciais e tente novamente.',
        payload: null,
      });
    }

    await this.explorerService.updateById(explorer.id, { token: data.token });

    const tokenBase: Token = {
      id: explorer.id,
      email: explorer.email,
      name: explorer.name,
      type: explorer.profile.type,
    };

    const { token } = this.authenticationService.createToken(tokenBase);

    const payload: AuthenticationPayload = {
      user: tokenBase,
      token: token,
    };

    return this.utilsService.apiResponseSuccess<AuthenticationPayload>({
      message: 'Login realizado com sucesso.',
      payload: payload,
    });
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
    const explorers = await this.explorerService.findAll();

    return this.utilsService.apiResponseSuccessOrFail<GetAllExplorersPayload>({
      success: !!explorer,
      onSuccess: {
        message: 'O explorador foi atualizado.',
        payload: { explorers },
      },
      onFail: { message: 'Ocorreu um erro ao atualizar o explorador.' },
    });
  }

  @Put('active-explorers')
  async activeExplorers(@Body() dto: ActiveExplorersParams) {
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
