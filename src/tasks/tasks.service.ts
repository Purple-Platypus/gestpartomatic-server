import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import TodoDto from 'src/todos/dto/todo.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  create(createTaskDto: CreateTaskDto) {
    return 'This action adds a new task';
  }

  findAll() {
    return `This action returns all tasks`;
  }

  async findBoardTasks(boardId): Promise<TodoDto[]> {
    const listIds = await this.prisma.list.findMany({
      select: {
        id: true,
      },
      where: {
        boardId,
      },
    });

    const listIdsArray = listIds.map((list) => list.id);

    const boardTasks = await this.prisma.todo.findMany({
      where: {
        listId: { in: listIdsArray },
      },
      select: {
        id: true,
        title: true,
        description: true,
        listId: true,
        rank: true,
      },
    });

    return boardTasks;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
