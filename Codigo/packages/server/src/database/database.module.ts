import { UserAccess } from '@Models/UserAccess.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from '~/../ormconfig';

import { Administrator } from './entities/Administrator.entity';
import { Challenge } from './entities/Challenge.entity';
import { ChallengeAccepted } from './entities/ChallengeAccepted.entity';
import { ChallengeAcceptedResponse } from './entities/ChallengeAcceptedResponse.entity';
import { Comment } from './entities/Comment.entity';
import { Explorer } from './entities/Explorer.entity';
import { Notification } from './entities/Notification.entity';
import { Post } from './entities/Post.entity';
import { Profile } from './entities/Profile.entity';
import { Recompense } from './entities/Recompense.entity';
import { SavedFile } from './entities/SavedFile.entity';
import { SocialMedia } from './entities/SocialMedia.entity';
import { SocialMediaParam } from './entities/SocialMediaParam.entity';
import { User } from './entities/User.entity';
import { ExplorerSeed } from './seeds/explorer.seed';
import { ExplorersSeed } from './seeds/explorers.seed';
import { ProfileSeed } from './seeds/profile.seed';
import { SocialMediaSeed } from './seeds/social-media.seed';
import { UserSeed } from './seeds/user.seed';

const repositories = TypeOrmModule.forFeature([
  Administrator,
  Challenge,
  ChallengeAccepted,
  ChallengeAcceptedResponse,
  Comment,
  Explorer,
  Notification,
  Post,
  Profile,
  Recompense,
  SavedFile,
  SocialMedia,
  SocialMediaParam,
  User,
  UserAccess,
]);

@Module({
  imports: [TypeOrmModule.forRoot(config), repositories],
  providers: [
    ProfileSeed,
    SocialMediaSeed,
    UserSeed,
    ExplorerSeed,
    ExplorersSeed,
  ],
  exports: [repositories],
})
export class DatabaseModule {}
