import { SetMetadata } from '@nestjs/common';
import { UserType } from '@sec/common';

export const Roles = (roles: UserType[]) => SetMetadata('roles', roles);
