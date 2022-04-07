import { UserAccess as IUserAccess } from '@sec/common';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Model } from './Model.abstract';
import { User } from './User.entity';

console.log(Model);
@Entity()
export class UserAccess extends Model implements IUserAccess {
  @Column()
  accessDate: Date;

  @ManyToOne(() => User, (user) => user.id)
  user: User;
}
