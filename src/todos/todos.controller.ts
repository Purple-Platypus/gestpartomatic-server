import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import TodoDto from './dto/todo.dto';
import { TodosService } from './todos.service';
import JwtAuthGuard from 'src/auth/guards/jwtAuth.guard';
import { Todo, User } from '@prisma/client';
import UpdateTodoDto from './dto/update-todo.dto';
import CreateTodoDto from './dto/create-todo.dto';

@ApiTags('todos')
@Controller('todos')
@UseInterceptors(ClassSerializerInterceptor)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  // Récupération de la liste des équipes
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: `Création d'un todo`,
  })
  async create(
    @Req() req: User,
    @Body() todoData: CreateTodoDto,
  ): Promise<Todo> {
    const createdTodo = this.todosService.create(req['user'].id, todoData);
    return createdTodo;
  }

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
  @ApiBearerAuth()
  @ApiOperation({ summary: "Modification d'un todo" })
  async patch(
    @Param('id') todoId: string,
    @Body() todoData: UpdateTodoDto,
  ): Promise<Todo> {
    const parsedTodoId = parseInt(todoId);

    const updatedTodo = this.todosService.update(parsedTodoId, todoData);
    return updatedTodo;
  }

  // Modification d'une liste de todos
  @Patch()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Modification d'une liste de todos" })
  async patchMany(@Body() todosData: UpdateTodoDto[]): Promise<void> {
    return this.todosService.updateMany(todosData);
  }

  // Suppression d'un todo
  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Suppression d'un todo" })
  async delete(@Param('id') todoId: string): Promise<void> {
    const parsedTodoId = parseInt(todoId);

    this.todosService.delete(parsedTodoId);
    return;
  }
}
