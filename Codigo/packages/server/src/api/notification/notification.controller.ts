import {
  Controller,
  UseGuards,
  Body,
  Req,
  Get,
  Request,
  Param,
} from '@nestjs/common';
import { GetUserNotificationsPayload, NotificationStatus } from '@sec/common';
import { JwtAuthGuard } from '~/authentication/jwt-auth.guard';
import { Roles } from '~/authentication/role.guard';
import { RequestWithUser } from '~/authentication/roles.guard';
import { UtilsService } from '~/utils/utils.service';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly utilsService: UtilsService,
  ) {}

  @Get()
  @Roles('*')
  public async getUserNotifications(@Request() request: RequestWithUser) {
    const { user } = request;
    const notifications = await this.notificationService.getUserNotifications(
      user.id,
    );

    return this.utilsService.apiResponseSuccessOrFail<GetUserNotificationsPayload>(
      {
        success: !!notifications,
        onSuccess: {
          message: 'Lista de notificações do usuário.',
          payload: { notifications },
        },
        onFail: {
          message: 'Ocorreu um erro ao recuperar as notificações.',
        },
      },
    );
  }

  @Get(':id')
  @Roles('*')
  public async markNotificationAsRead(
    @Param('id') id: string,
    @Request() request: RequestWithUser,
  ) {
    if (!Number(id)) return this.utilsService.apiResponseInvalidBody(null);

    const result = await this.notificationService.updateById(+id, {
      status: NotificationStatus.READ,
    });

    return this.utilsService.apiResponseSuccessOrFail<GetUserNotificationsPayload>(
      {
        success: !!result,
        onSuccess: {
          message: 'Notificação atualizada.',
          payload: {
            notifications: await this.notificationService.getUserNotifications(
              request.user.id,
            ),
          },
        },
        onFail: {
          message: 'Ocorreu um erro ao atualizar a notificação.',
        },
      },
    );
  }
}
