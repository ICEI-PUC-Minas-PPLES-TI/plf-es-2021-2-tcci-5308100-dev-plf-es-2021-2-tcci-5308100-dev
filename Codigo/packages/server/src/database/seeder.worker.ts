import { seeder } from '~/utils/seeder.utils';
import { ExplorerSeed } from '~/database/seeds/explorer.seed';
import { ProfileSeed } from '~/database/seeds/profile.seed';
import { SocialMediaSeed } from '~/database/seeds/social-media.seed';
import { UserSeed } from '~/database/seeds/user.seed';

seeder(ProfileSeed);
seeder(ExplorerSeed);
seeder(UserSeed);

seeder(SocialMediaSeed);
