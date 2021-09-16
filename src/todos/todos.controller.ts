import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import TodoDto from './dto/todo.dto';
import { TodosService } from './todos.service';
import JwtAuthGuard from 'src/auth/guards/jwtAuth.guard';
import { User } from '@prisma/client';
import UpdateTodoDto from './dto/update-todo.dto';

@ApiTags('todos')
@Controller('todos')
@UseInterceptors(ClassSerializerInterceptor)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  // Récupération de la liste des équipes
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: `Récupération de la liste des todos privés de l'utilisateur`,
  })
  async list(@Req() req: User): Promise<TodoDto[]> {
    const todos = this.todosService.getPrivate(req['user'].id);
    return todos;
  }

  // Modification d'un todo
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Modification d'un todo" })
  async patch(
    @Param('id') todoId: string,
    @Body() todoData: UpdateTodoDto,
  ): Promise<void> {
    const parsedTodoId = parseInt(todoId);
    console.log(todoData);

    this.todosService.update(parsedTodoId, todoData);
    return;
  }
}
