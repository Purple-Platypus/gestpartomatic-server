import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import TodoDto from './dto/todo.dto';
import UpdateTodoDto from './dto/update-todo.dto';

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  public async getPrivate(userId: string): Promise<TodoDto[]> {
    const selectParams = {
      select: {
        id: true,
        title: true,
        description: true,
        isArchived: true,
        isPrivate: true,
        rank: true,
        deadline: true,
        author: true,
        tags: true,
      },
      where: {
        authorId: userId,
      },
    };

    const todos = await this.prisma.todo.findMany(selectParams);
    return todos;
  }

  // Modification d'un todo
  public async update(todoId: number, todoData: UpdateTodoDto): Promise<void> {
    await this.prisma.todo.update({
      where: {
        id: todoId,
      },
      data: todoData,
    });
  }
}
