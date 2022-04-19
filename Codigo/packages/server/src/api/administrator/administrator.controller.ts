import {
  Controller,
  UseGuards,
  Body,
  Post,
  Get,
  Put,
  Param,
  Query,
} from '@nestjs/common';
import {
  AdministratorStatus,
  AuthenticationPayload,
  CreateAdministratorDTO,
  createAdministratorValidator,
  GetAdministratorPayload,
  GetAllAdministratorsParams,
  GetAllAdministratorsPayload,
  Token,
  UpdateAdministratorDTO,
  updateAdministratorValidator,
  UserType,
} from '@sec/common';
import { In } from 'typeorm';
import { AuthenticationService } from '~/authentication/authentication.service';
import { Roles } from '~/authentication/role.guard';
import { PublicRoute } from '~/utils/public-route.decorator';
import { UtilsService } from '~/utils/utils.service';
import { AdministratorService } from './administrator.service';

@Controller('administrator')
@Roles([UserType.SUPER_ADMINISTRATOR])
export class AdministratorController {
  constructor(
    private readonly administratorService: AdministratorService,
    private readonly authenticationService: AuthenticationService,
    private readonly utilsService: UtilsService,
  ) {}

  @PublicRoute()
  @Post('/login')
  async login(
    @Body() { email, password }: { email: string; password: string },
  ) {
    const administrator =
      await this.administratorService.findByEmailWithPassword(email);

    if (!administrator) {
      return this.utilsService.apiResponseFail({
        message:
          'E-mail e/ou senha inválidos. Por favor, confira as credenciais e tente novamente.',
        payload: null,
      });
    } else if (administrator.status !== AdministratorStatus.ACTIVE) {
      return this.utilsService.apiResponseFail({
        message: 'Usuário inativo.',
      });
    }

    if (
      administrator &&
      (await this.authenticationService.validateUser(
        password,
        administrator.password,
      ))
    ) {
      const { id, email: administratorEmail, name, profile } = administrator;

      const tokenBase: Token = {
        id,
        email: administratorEmail,
        name,
        type: profile.type,
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
    } else {
      return this.utilsService.apiResponseFail({
        message:
          'E-mail e/ou senha inválidos. Por favor, confira as credenciais e tente novamente.',
        payload: null,
      });
    }
  }

  @Get()
  async getAllAdministrators(@Query() queries: GetAllAdministratorsParams) {
    const administrators = await this.administratorService.find({
      where: {
        ...(queries.status ? { status: In(queries.status) } : undefined),
      },
    });

    return this.utilsService.apiResponse<GetAllAdministratorsPayload>({
      status: !!administrators ? 'SUCCESS' : 'FAIL',
      message: 'Lista com todos os administradores cadastrados.',
      payload: { administrators: administrators },
    });
  }

  @Get(':id')
  async getAdministrator(@Param('id') id: string) {
    if (!Number(id)) return this.utilsService.apiResponseInvalidBody(null);

    const administrator = await this.administratorService.findOneById(+id);

    return this.utilsService.apiResponse<GetAdministratorPayload>({
      status: !!administrator ? 'SUCCESS' : 'FAIL',
      message: 'Detalhes do administrador.',
      payload: { administrator: administrator },
    });
  }

  @Post()
  async createAdministrator(@Body() body: CreateAdministratorDTO) {
    const { success, dto, error } = await createAdministratorValidator(body);

    if (!success) return this.utilsService.apiResponseInvalidBody(error);

    const administrator = await this.administratorService.createAndSendPassword(
      dto,
    );

    return this.utilsService.apiResponseSuccessOrFail<GetAdministratorPayload>({
      success: !!administrator,
      onSuccess: {
        message: 'O novo administrador foi cadastrado.',
        payload: { administrator },
      },
      onFail: { message: 'Ocorreu um erro ao cadastrar o administrador.' },
    });
  }

  @Put()
  async updateAdministrator(@Body() body: UpdateAdministratorDTO) {
    const { success, dto, error } = await updateAdministratorValidator(body);

    if (!success) return this.utilsService.apiResponseInvalidBody(error);

    const administrator =
      await this.administratorService.updateByIdAndSendPassword(body.id, dto);

    return this.utilsService.apiResponseSuccessOrFail<GetAdministratorPayload>({
      success: !!administrator,
      onSuccess: {
        message: 'O administrador foi atualizado.',
        payload: { administrator },
      },
      onFail: { message: 'Ocorreu um erro ao atualizar o administrador.' },
    });
  }
}
