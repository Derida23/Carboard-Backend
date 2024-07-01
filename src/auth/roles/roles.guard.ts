
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './roles.enum';
import { ROLES_KEY } from './roles.decorator';

//Role Guard
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    //get the user object from the request object
    const { user } = context.switchToHttp().getRequest();
    console.log(requiredRoles.some((role) => user.roles === role))
    //check if the user has the required roles if the user has the required roles, return true else return false
    return requiredRoles.some((role) => user.roles === role);
  }
}