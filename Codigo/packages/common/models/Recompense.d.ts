import { Challenge } from './Challenge';
import { Model } from './Model';
export declare enum RecompenseType {
    DISCOUNT_COUPON = "DISCOUNT_COUPON",
    GENERAL = "GENERAL"
}
export declare enum RecompenseStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}
export interface Recompense extends Model {
    name: string;
    instructions: string;
    type: RecompenseType;
    code: string;
    status: RecompenseStatus;
    challenges: Challenge[];
}
