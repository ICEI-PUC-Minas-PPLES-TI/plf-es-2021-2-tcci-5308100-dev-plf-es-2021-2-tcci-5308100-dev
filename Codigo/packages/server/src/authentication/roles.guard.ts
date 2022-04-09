import {
  CanActivate,
  ExecutionContext,
  Injectable,
  mixin,
  Type,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Token, UserType } from '@sec/common';
import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: Token;
}

export const RolesGuard = (role: UserType[]): Type<CanActivate> => {
  @Injectable()
  class RolesGuardMixin implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
      const isPublic = this.reflector.get<boolean>(
        'isPublic',
        context.getHandler(),
      );

      if (isPublic) {
        return true;
      }

      const { user } = context.switchToHttp().getRequest<RequestWithUser>();

      return role.includes(user?.type);
    }
  }

  return mixin(RolesGuardMixin);
};

@Injectable()
export class RolesGuardClass implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const roles = this.reflector.getAllAndOverride<UserType[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    const req = context.switchToHttp().getRequest<RequestWithUser>();

    const { user } = req;

    if (Array.isArray(roles)) {
      return roles.length === 0 ? false : roles.includes(user?.type);
    } else {
      return [UserType.SUPER_ADMINISTRATOR, UserType.ADMINISTRATOR].includes(
        user?.type,
      );
    }
  }
}
