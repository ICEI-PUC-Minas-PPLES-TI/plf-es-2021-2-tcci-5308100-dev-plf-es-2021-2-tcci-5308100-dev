import { Controller, UseGuards, Body, Req, Post } from '@nestjs/common';
import {
  CreateCommentDTO,
  CreateCommentPayload,
  createCommentValidator,
  UserType,
} from '@sec/common';
import { JwtAuthGuard } from '~/authentication/jwt-auth.guard';
import { Roles } from '~/authentication/role.guard';
import { RequestWithUser } from '~/authentication/roles.guard';
import { UtilsService } from '~/utils/utils.service';
import { NotificationService } from '../notification/notification.service';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly notificationService: NotificationService,
    private readonly utilsService: UtilsService,
  ) {}

  @Post()
  @Roles([
    UserType.SUPER_ADMINISTRATOR,
    UserType.ADMINISTRATOR,
    UserType.EXPLORER,
  ])
  async createComment(
    @Body() body: CreateCommentDTO,
    @Req() request: RequestWithUser,
  ) {
    const { success, dto, error } = await createCommentValidator(body);

    if (!success) return this.utilsService.apiResponseInvalidBody(error);

    const { user } = request;
    const commentSaved = await this.commentService.createAndSaveAux({
      ...dto,
      explorerId: user.id,
    });

    if (commentSaved && user.type !== UserType.EXPLORER)
      await this.notificationService.notifyExplorerNewComment(
        dto.acceptedChallengeId,
      );

    const comment = commentSaved
      ? await this.commentService.getOneById(commentSaved.id)
      : undefined;
    return this.utilsService.apiResponseSuccessOrFail<CreateCommentPayload>({
      success: !!comment,
      onSuccess: {
        message: 'Comentário salvo.',
        payload: { comment },
      },
      onFail: { message: 'Ocorreu um erro ao salvar o comentário.' },
    });
  }
}
