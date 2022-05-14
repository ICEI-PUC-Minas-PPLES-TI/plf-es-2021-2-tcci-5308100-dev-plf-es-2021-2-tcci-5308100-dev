import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationModule } from '~/authentication/authentication.module';
import { JwtAuthGuard } from '~/authentication/jwt-auth.guard';
import { RolesGuardClass } from '~/authentication/roles.guard';
import { DatabaseModule } from '~/database/database.module';
import { FilesModule } from '~/files/files.module';
import { ShopifyModule } from '~/shopify/shopify.module';
import { UtilsModule } from '~/utils/utils.module';
import { AdministratorController } from './administrator/administrator.controller';
import { AdministratorService } from './administrator/administrator.service';
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
import { ReportsService } from './reports/reports.service';
import { ReportsController } from './reports/reports.controller';
import { UserAccessService } from './user-access/user-access.service';
import { EmailModule } from '~/email/email.module';

@Module({
  imports: [
    UtilsModule,
    DatabaseModule,
    AuthenticationModule,
    ShopifyModule,
    FilesModule,
    EmailModule,
  ],
  controllers: [
    AdministratorController,
    ChallengeController,
    ChallengeAcceptedController,
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
    ReportsController,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuardClass,
    },
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
    ReportsService,
    UserAccessService,
  ],
  exports: [AdministratorService],
})
export class ApiModule {}
