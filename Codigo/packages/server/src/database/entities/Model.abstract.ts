import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Model as IModel } from '@sec/common';

// console.log(User);
export abstract class Model implements IModel {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  // @ManyToOne(() => User, (user) => user.id, { nullable: true })
  // @JoinColumn()
  // createdBy: User;

  // @ManyToOne(() => User, (user) => user.id, { nullable: true })
  // @JoinColumn()
  // updatedBy: User;

  // @ManyToOne(() => User, (user) => user.id, { nullable: true })
  // @JoinColumn()
  // deletedBy: User;

  // @BeforeInsert()
  // onCreate() {
  //   const user = RequestContextStorage.getUser();

  //   if (user) {
  //     this.createdBy = (user as any).id;
  //     this.updatedBy = (user as any).id;
  //   }
  // }

  // @BeforeUpdate()
  // onUpdate() {
  //   const user = RequestContextStorage.getUser();

  //   if (user) {
  //     this.updatedBy = (user as any).id;
  //   }
  // }

  // @BeforeRemove()
  // onDelete() {
  //   const user = RequestContextStorage.getUser();

  //   if (user) {
  //     this.deletedBy = (user as any).id;
  //   }
  // }
}
