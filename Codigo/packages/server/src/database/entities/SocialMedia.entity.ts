import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { Model } from './Model.abstract';
import { Post } from './Post.entity';
import { SocialMediaParam } from './SocialMediaParam.entity';
import { SocialMedia as ISocialMedia, SocialMediaName } from '@sec/common';

console.log('SocialMedia :>>', Model);
@Entity()
export class SocialMedia extends Model implements ISocialMedia {
  @Column({ type: 'enum', enum: SocialMediaName })
  name: SocialMediaName;

  @OneToMany(() => Post, (post) => post.socialMedia)
  posts: Post[];

  @ManyToMany(
    () => SocialMediaParam,
    (socialMediaParam) => socialMediaParam.socialMedias,
  )
  socialMediaParams: SocialMediaParam[];
}
