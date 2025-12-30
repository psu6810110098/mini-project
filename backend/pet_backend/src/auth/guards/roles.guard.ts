import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../roles.decorator';
import { UserRole } from '../../users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    // If no role is required, allow access
    if (!requiredRoles) {
      return true;
    }

    // Get user from Request (injected by JwtStrategy)
    const { user } = context.switchToHttp().getRequest();
    
    // Check if user has the role
    return requiredRoles.includes(user?.role);
  }
}