import {
  AfterLoad,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Model } from './Model.abstract';
import { SocialMedia } from './SocialMedia.entity';
import { Post as IPost, PostStatus, SocialMediaName } from '@sec/common';

console.log('Post :>>', Model);
@Entity()
export class Post extends Model implements IPost {
  @Column({ type: 'enum', enum: PostStatus })
  status: PostStatus;

  @Column({ unique: true })
  token: string;

  @Column()
  url: string;

  @ManyToOne(() => SocialMedia, (socialMedia) => socialMedia.posts)
  socialMedia: SocialMedia;

  type: SocialMediaName;

  @AfterLoad()
  getType() {
    if (this.socialMedia) this.type = this.socialMedia.name;
  }
}
