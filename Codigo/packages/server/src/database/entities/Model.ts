import {
  BeforeInsert,
  BeforeRemove,
  BeforeUpdate,
  CreateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RequestContextStorage } from '~/utils/context.middleware';
import { User } from './User.entity';
import { Model as IModel } from '@sec/common';

export abstract class Model implements IModel {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn()
  createdBy: User;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn()
  updatedBy: User;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn()
  deletedBy: User;

  @BeforeInsert()
  onCreate() {
    const user = RequestContextStorage.getUser();

    if (user) {
      this.createdBy = user.id as any;
      this.updatedBy = user.id as any;
    }
  }

  @BeforeUpdate()
  onUpdate() {
    const user = RequestContextStorage.getUser();

    if (user) {
      this.updatedBy = user.id as any;
    }
  }

  @BeforeRemove()
  onDelete() {
    const user = RequestContextStorage.getUser();

    if (user) {
      this.deletedBy = user.id as any;
    }
  }
}
