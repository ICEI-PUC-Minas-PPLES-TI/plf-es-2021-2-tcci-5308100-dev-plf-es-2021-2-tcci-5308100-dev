import { Controller, UseGuards, Body, Req } from '@nestjs/common';
import { JwtAuthGuard } from '~/authentication/jwt-auth.guard';
import { UtilsService } from '~/utils/utils.service';
import { SocialMediaParamService } from './socialMediaParam.service';

@Controller('socialMediaParam')
@UseGuards(JwtAuthGuard)
export class SocialMediaParamController {
  constructor(
    private readonly socialMediaParamService: SocialMediaParamService,
    private readonly utilsService: UtilsService,
  ) {}
}
