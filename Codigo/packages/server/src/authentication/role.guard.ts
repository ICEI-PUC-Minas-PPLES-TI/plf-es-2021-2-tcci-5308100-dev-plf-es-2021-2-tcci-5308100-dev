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

interface RequestWithUser extends Request {
  user: Token;
}

export const RoleGuard = (role: UserType[]): Type<CanActivate> => {
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
