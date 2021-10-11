import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { BoardsService } from '../boards.service';

@Injectable()
export class BoardCreatorGuard implements CanActivate {
  constructor(private readonly boardsService: BoardsService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  private validateRequest(request) {
    const userId = request.user.id;
    const boardId = request.params.id;

    return this.boardsService.checkCreator(userId, +boardId);
  }
}
