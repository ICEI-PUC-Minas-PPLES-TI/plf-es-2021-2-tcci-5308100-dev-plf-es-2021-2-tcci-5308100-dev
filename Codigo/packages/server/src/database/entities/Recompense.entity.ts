import { Column, Entity, OneToMany } from 'typeorm';
import { Challenge } from './Challenge.entity';
import { Model } from './Model.abstract';
import {
  Recompense as IRecompense,
  RecompenseType,
  RecompenseStatus,
} from '@sec/common';

console.log('Recompense :>>', Model);
@Entity()
export class Recompense extends Model implements IRecompense {
  @Column()
  name: string;

  @Column({ length: 2000, select: false })
  instructions: string;

  @Column({ type: 'enum', enum: RecompenseType })
  type: RecompenseType;

  @Column({ nullable: true, select: false })
  code?: string;

  @Column({ type: 'enum', enum: RecompenseStatus })
  status: RecompenseStatus;

  @OneToMany(() => Challenge, (challenge) => challenge.recompense)
  challenges: Challenge[];
}
