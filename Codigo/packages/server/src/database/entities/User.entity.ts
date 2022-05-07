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
import { User as IUser, UserStatus, UserType } from '@sec/common';

console.log('User :>>', Model);
@Entity()
@TableInheritance({
  column: { type: 'enum', enum: UserType, name: 'typeEntity' },
})
export class User extends Model implements IUser {
  @Column({ type: 'enum', enum: UserStatus })
  status: string;

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

  // FIXME: Bug; Dependência circular encontrada.
  // @OneToMany(() => Comment, (comment) => comment.user)
  // comments: Comment[];

  // FIXME: Solução para permitir recuperar o usuário do comentário no ChallengeAcceptedController.getChallengeAccepted
  // Essa solução é necessária por causa do problema de dependência circular
  getCountChallengeCompleted() {
    return 0;
  }
}
