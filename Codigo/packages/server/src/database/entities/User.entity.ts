import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  TableInheritance,
} from 'typeorm';
import { Model } from './Model.abstract';
import { Notification } from './Notification.entity';
import { Profile } from './Profile.entity';
import { User as IUser, UserType } from '@sec/common';

console.log(Model);
@Entity()
@TableInheritance({
  column: { type: 'enum', enum: UserType, name: 'typeEntity' },
})
export class User extends Model implements IUser {
  @Column()
  nickname: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @ManyToOne(() => Profile, (profile) => profile.users)
  profile: Profile;

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  //Bug; Dependência circular encontrada.
  // @OneToMany(() => Comment, (comment) => comment.user)
  // comments: Comment[];
}
