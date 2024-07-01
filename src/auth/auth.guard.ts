import {
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthGuard as AuthGuardPassport } from '@nestjs/passport';

export class AuthGuard extends AuthGuardPassport('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: Error, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}