import { ChildEntity, Column } from 'typeorm';
import { User } from './User.entity';
import {
  Administrator as IAdministrator,
  AdministratorStatus,
  UserType,
} from '@sec/common';

console.log('Administrator :>>', User);
@ChildEntity(UserType.ADMINISTRATOR)
export class Administrator extends User implements IAdministrator {
  constructor() {
    super();
  }

  @Column({ select: false })
  password: string;

  @Column()
  isSuper: boolean;

  // @Column({ type: 'enum', enum: AdministratorStatus })
  status: AdministratorStatus;
}
