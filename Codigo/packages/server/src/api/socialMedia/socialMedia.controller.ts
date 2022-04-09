import { Controller, UseGuards, Body, Req } from '@nestjs/common';
import { JwtAuthGuard } from '~/authentication/jwt-auth.guard';
import { UtilsService } from '~/utils/utils.service';
import { SocialMediaService } from './socialMedia.service';

@Controller('social-media')
export class SocialMediaController {
  constructor(
    private readonly socialMediaService: SocialMediaService,
    private readonly utilsService: UtilsService,
  ) {}
}
