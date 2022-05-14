import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { BaseService } from '~/database/BaseService.abstract';
import { Notification } from '@Models/Notification.entity';
import { User } from '@Models/User.entity';
import { NotificationStatus } from '@sec/common';
import { ChallengeAcceptedService } from '../challenge-accepted/challenge-accepted.service';

@Injectable()
export class NotificationService extends BaseService<Notification> {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly challengeAcceptedService: ChallengeAcceptedService,
  ) {
    super(notificationRepository, []);
    this.notificationRepository = notificationRepository;
  }

  public async getUserNotifications(userId: number): Promise<Notification[]> {
    try {
      const notifications = await this.find({
        where: { user: { id: userId } },
        order: {
          createdAt: 'DESC',
        },
      });
      return notifications;
    } catch (error) {
      return undefined;
    }
  }

  public async notifyChallengeResponseEvaluated(
    acceptedChallengeId: number,
  ): Promise<boolean> {
    try {
      const challengeAccepted =
        await this.challengeAcceptedService.findOneByIdWithRelations(
          acceptedChallengeId,
          ['challenge', 'explorer'],
        );

      const notification = await this.createAndSave({
        user: challengeAccepted.explorer,
        title: 'Resposta avaliada',
        text: `A resposta que você enviou no desafio <b>${challengeAccepted.challenge.title}</b> foi avaliada`,
        status: NotificationStatus.UNREAD,
      });

      if (!!notification) return true;
      else return false;
    } catch (error) {
      return false;
    }
  }

  public async notifyExplorerNewComment(
    acceptedChallengeId: number,
  ): Promise<boolean> {
    try {
      const challengeAccepted =
        await this.challengeAcceptedService.findOneByIdWithRelations(
          acceptedChallengeId,
          ['challenge', 'explorer'],
        );

      const notification = await this.createAndSave({
        user: challengeAccepted.explorer,
        title: 'Novo comentário',
        text: `Um administrador comentou no desafio <b>${challengeAccepted.challenge.title}</b>`,
        status: NotificationStatus.UNREAD,
      });

      if (!!notification) return true;
      else return false;
    } catch (error) {
      return false;
    }
  }
}
