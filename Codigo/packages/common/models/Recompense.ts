import { Challenge } from './Challenge';
import { Model } from './Model';

export enum RecompenseType {
  DISCOUNT_COUPON = 'DISCOUNT_COUPON',
  GENERAL = 'GENERAL',
  GIFT_CARD = 'GIFT_CARD'
}

export enum RecompenseStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface Recompense extends Model {
  name: string;
  instructions: string;
  type: RecompenseType;
  code?: string;
  status: RecompenseStatus;
  challenges: Challenge[];
}
