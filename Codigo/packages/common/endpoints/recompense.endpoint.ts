import { ShopifyDiscountCoupon } from '../index';
import { Recompense, RecompenseStatus, RecompenseType } from '../models/Recompense';

export type GetAllRecompensesParams = {
  type?: RecompenseType[];
  status?: RecompenseStatus[];
};

export type GetAllRecompensesPayload = {
  recompenses: Recompense[];
};

export type GetRecompenseBasePayload = {
  discountCoupons: ShopifyDiscountCoupon[];
};

export type GetRecompensePayload = {
  recompense: Recompense;
};

export declare type CreateRecompensePayload = {
  recompense: Recompense;
};

export declare type UpdateRecompensePayload = {
  recompense: Recompense;
};
