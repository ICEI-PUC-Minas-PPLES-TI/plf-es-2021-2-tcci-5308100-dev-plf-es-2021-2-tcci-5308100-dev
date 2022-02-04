import { Column, Entity, OneToMany } from 'typeorm';
import { Model } from './Model';
import { User } from './User.entity';
import { Profile as IProfile, UserType } from '@sec/common';

@Entity()
export class Profile extends Model implements IProfile {
  @Column({ enum: UserType })
  type: UserType;

  @OneToMany(() => User, (user) => user.profile)
  users: User[];
}
