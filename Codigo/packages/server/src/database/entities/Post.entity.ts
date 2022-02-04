import { Column, Entity, ManyToOne } from 'typeorm';
import { Model } from './Model';
import { SocialMedia } from './SocialMedia.entity';
import { Post as IPost, PostStatus } from '@sec/common';

@Entity()
export class Post extends Model implements IPost {
  @Column({ enum: PostStatus })
  status: PostStatus;

  @Column()
  token: string;

  @ManyToOne(() => SocialMedia, (socialMedia) => socialMedia.posts)
  socialMedia: SocialMedia;
}
