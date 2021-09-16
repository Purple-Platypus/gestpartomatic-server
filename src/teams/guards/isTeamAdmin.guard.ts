import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class IsTeamAdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();
    const teamId = context.getArgs()[0].params.id;

    const isTeamAdmin = user.teams.some((teammate) => {
      return teammate.role == 'ADMIN' && teammate.team.id == teamId;
    });

    return isTeamAdmin;
  }
}
