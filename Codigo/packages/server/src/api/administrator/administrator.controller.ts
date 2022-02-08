import { Controller, UseGuards, Body, Req, Post } from '@nestjs/common';
import { AuthenticationPayload, Token, UserType } from '@sec/common';
import { AuthenticationService } from '~/authentication/authentication.service';
import { JwtAuthGuard } from '~/authentication/jwt-auth.guard';
import { PublicRoute } from '~/authentication/public-route.decorator';
import { UtilsService } from '~/utils/utils.service';
import { AdministratorService } from './administrator.service';

@Controller('administrator')
@UseGuards(JwtAuthGuard)
export class AdministratorController {
  constructor(
    private readonly administratorService: AdministratorService,
    private readonly authenticationService: AuthenticationService,
    private readonly utilsService: UtilsService,
  ) {}

  @PublicRoute()
  @Post('login')
  async login(
    @Body() { email, password }: { email: string; password: string },
  ) {
    const administrator =
      await this.administratorService.findByEmailWithPassword(email);

    if (
      administrator &&
      (await this.authenticationService.validateUser(
        password,
        administrator.password,
      ))
    ) {
      const { id, email: administratorEmail, name } = administrator;

      const tokenBase: Token = {
        id,
        email: administratorEmail,
        name,
        type: UserType.ADMINISTRATOR,
      };

      const { token } = this.authenticationService.createToken(tokenBase);

      const payload: AuthenticationPayload = {
        user: tokenBase,
        token: token,
      };

      return this.utilsService.apiResponseSuccess({
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
}
