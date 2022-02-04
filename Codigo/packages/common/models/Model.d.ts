import { User } from './User';
export interface Model {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    createdBy: User;
    updatedBy: User;
    deletedBy: User;
}
