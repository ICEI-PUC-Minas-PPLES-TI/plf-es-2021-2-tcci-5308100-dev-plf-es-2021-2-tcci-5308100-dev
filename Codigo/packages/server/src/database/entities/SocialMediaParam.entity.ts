import { AfterLoad, Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Model } from './Model.abstract';
import { SocialMedia } from './SocialMedia.entity';
import {
  SocialMediaParam as ISocialMediaParam,
  SocialMediaParamType,
  SocialMediaParamStatus,
  SocialMediaName,
} from '@sec/common';

console.log(Model);
@Entity()
export class SocialMediaParam extends Model implements ISocialMediaParam {
  @Column()
  param: string;

  @Column({ enum: SocialMediaParamType })
  type: SocialMediaParamType;

  @Column({ enum: SocialMediaParamStatus })
  status: SocialMediaParamStatus;

  @Column()
  approveAll: boolean;

  @ManyToMany(() => SocialMedia, (socialMedia) => socialMedia.socialMediaParams)
  @JoinTable()
  socialMedias: SocialMedia[];

  socialMediaNames: SocialMediaName[];

  @AfterLoad()
  getSocialMediaNames() {
    if (this.socialMedias) {
      this.socialMediaNames = this.socialMedias
        .map(({ name }) => name)
        .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    } else {
      this.socialMediaNames = null;
    }
  }
}
