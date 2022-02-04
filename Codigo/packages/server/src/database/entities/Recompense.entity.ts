import { Column, Entity, OneToMany } from 'typeorm';
import { Challenge } from './Challenge.entity';
import { Model } from './Model';
import {
  Recompense as IRecompense,
  RecompenseType,
  RecompenseStatus,
} from '@sec/common';

@Entity()
export class Recompense extends Model implements IRecompense {
  @Column()
  name: string;

  @Column({ length: 2000 })
  instructions: string;

  @Column({ enum: RecompenseType })
  type: RecompenseType;

  @Column({ nullable: true })
  code: string;

  @Column({ enum: RecompenseStatus })
  status: RecompenseStatus;

  @OneToMany(() => Challenge, (challenge) => challenge.recompense)
  challenges: Challenge[];
}
