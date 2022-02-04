import { Challenge } from './Challenge';
import { Model } from './Model';

export enum RecompenseType {
  DISCOUNT_COUPON = 'DISCOUNT_COUPON',
  GENERAL = 'GENERAL',
}

export enum RecompenseStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface Recompense extends Model {
  name: string;
  instructions: string;
  type: RecompenseType;
  code: string;
  status: RecompenseStatus;
  challenges: Challenge[];
}
