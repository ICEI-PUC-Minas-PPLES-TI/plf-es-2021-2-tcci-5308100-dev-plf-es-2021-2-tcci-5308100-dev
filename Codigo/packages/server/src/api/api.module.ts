import { Module } from '@nestjs/common';
import { AuthenticationModule } from '~/authentication/authentication.module';
import { DatabaseModule } from '~/database/database.module';
import { ShopifyModule } from '~/shopify/shopify.module';
import { UtilsModule } from '~/utils/utils.module';
import { AdministratorController } from './administrator/administrator.controller';
import { AdministratorService } from './administrator/administrator.service';
import { ChallengeAcceptedResponseController } from './challenge-accepted-response/challenge-accepted-response.controller';
import { ChallengeAcceptedResponseService } from './challenge-accepted-response/challenge-accepted-response.service';
import { ChallengeAcceptedController } from './challenge-accepted/challenge-accepted.controller';
import { ChallengeAcceptedService } from './challenge-accepted/challenge-accepted.service';
import { ChallengeController } from './challenge/challenge.controller';
import { ChallengeService } from './challenge/challenge.service';
import { CommentController } from './comment/comment.controller';
import { CommentService } from './comment/comment.service';
import { ExplorerController } from './explorer/explorer.controller';
import { ExplorerService } from './explorer/explorer.service';
import { NotificationController } from './notification/notification.controller';
import { NotificationService } from './notification/notification.service';
import { PostController } from './post/post.controller';
import { PostService } from './post/post.service';
import { ProfileController } from './profile/profile.controller';
import { ProfileService } from './profile/profile.service';
import { RecompenseController } from './recompense/recompense.controller';
import { RecompenseService } from './recompense/recompense.service';
import { SavedFileController } from './savedFile/savedFile.controller';
import { SavedFileService } from './savedFile/savedFile.service';
import { SocialMediaController } from './socialMedia/socialMedia.controller';
import { SocialMediaService } from './socialMedia/socialMedia.service';
import { SocialMediaParamController } from './socialMediaParam/socialMediaParam.controller';
import { SocialMediaParamService } from './socialMediaParam/socialMediaParam.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';

@Module({
  imports: [UtilsModule, DatabaseModule, AuthenticationModule, ShopifyModule],
  controllers: [
    AdministratorController,
    ChallengeController,
    ChallengeAcceptedController,
    ChallengeAcceptedResponseController,
    CommentController,
    ExplorerController,
    NotificationController,
    PostController,
    ProfileController,
    RecompenseController,
    SavedFileController,
    SocialMediaController,
    SocialMediaParamController,
    UserController,
  ],
  providers: [
    AdministratorService,
    ChallengeService,
    ChallengeAcceptedService,
    ChallengeAcceptedResponseService,
    CommentService,
    ExplorerService,
    NotificationService,
    PostService,
    ProfileService,
    RecompenseService,
    SavedFileService,
    SocialMediaService,
    SocialMediaParamService,
    UserService,
  ],
  exports: [AdministratorService],
})
export class ApiModule {}
