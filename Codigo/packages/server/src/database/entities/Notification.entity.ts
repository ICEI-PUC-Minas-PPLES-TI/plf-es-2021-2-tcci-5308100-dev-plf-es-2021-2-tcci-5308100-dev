import { Column, Entity, ManyToOne } from 'typeorm';
import { Model } from './Model.abstract';
import { User } from './User.entity';
import { Notification as INotification, NotificationStatus } from '@sec/common';

console.log(Model);
@Entity()
export class Notification extends Model implements INotification {
  @Column()
  text: string;

  @Column({ enum: NotificationStatus })
  status: NotificationStatus;

  @ManyToOne(() => User, (user) => user.notifications)
  user: User;
}