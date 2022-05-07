import { seeder } from '~/utils/seeder.utils';
import { ExplorerSeed } from '~/database/seeds/explorer.seed';
import { ProfileSeed } from '~/database/seeds/profile.seed';
import { SocialMediaSeed } from '~/database/seeds/social-media.seed';
import { UserSeed } from '~/database/seeds/user.seed';

const seederAll = async () => {
  await seeder(ProfileSeed);
  await seeder(ExplorerSeed);
  await seeder(UserSeed);
  await seeder(SocialMediaSeed);
};

seederAll();
