import { Column, Entity, OneToMany } from 'typeorm';
import { Model } from './Model.abstract';
import { User } from './User.entity';
import { Profile as IProfile, UserType } from '@sec/common';

console.log('Profile :>>', Model);
@Entity()
export class Profile extends Model implements IProfile {
  @Column({ type: 'enum', enum: UserType })
  type: UserType;

  @OneToMany(() => User, (user) => user.profile)
  users: User[];
}
