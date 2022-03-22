import { Controller, UseGuards, Body, Req } from '@nestjs/common';
import { JwtAuthGuard } from '~/authentication/jwt-auth.guard';
import { UtilsService } from '~/utils/utils.service';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly utilsService: UtilsService,
  ) {}
}
