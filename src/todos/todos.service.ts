import { Todo } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import CreateTodoDto from './dto/create-todo.dto';
import TodoDto from './dto/todo.dto';
import UpdateTodoDto from './dto/update-todo.dto';

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  // Modification d'un todo
  public async create(
    authorId: string,
    todoData: CreateTodoDto,
  ): Promise<Todo> {
    const createdTodo = await this.prisma.todo.create({
      data: {
        ...todoData,
        author: { connect: { id: authorId } },
      },
    });
    return createdTodo;
  }

  public async getPrivate(userId: string): Promise<TodoDto[]> {
    const selectParams = {
      select: {
        id: true,
        title: true,
        description: true,
        progression: true,
        isArchived: true,
        isPrivate: true,
        rank: true,
        deadline: true,
        author: true,
      },
      where: {
        authorId: userId,
        isPrivate: true,
      },
    };

    const todos = await this.prisma.todo.findMany(selectParams);
    return todos;
  }

  // Modification d'un todo
  public async update(
    todoId: number,
    todoData: UpdateTodoDto,
  ): Promise<TodoDto> {
    const updatedTodo = await this.prisma.todo.update({
      where: {
        id: todoId,
      },
      data: todoData,
    });
    return updatedTodo;
  }

  // Suppression d'un todo
  public async delete(todoId: number): Promise<void> {
    await this.prisma.todo.delete({
      where: { id: todoId },
    });
  }
}
