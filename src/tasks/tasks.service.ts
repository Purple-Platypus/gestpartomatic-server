import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { parse } from 'cookie';
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import TodoDto from 'src/todos/dto/todo.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import TaskDto from './dto/task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async getUserFromSocket(socket: Socket) {
    const cookie = socket.request.headers.cookie;

    const { Authentication: authenticationToken } = parse(cookie);
    const user = await this.authService.getUserFromAuthToken(
      authenticationToken,
    );
    if (!user) {
      throw new WsException('Invalid credentials.');
    }
    return user;
  }

  async create(
    authorId: string,
    createTaskData: CreateTaskDto,
  ): Promise<TaskDto> {
    const { listId, assignees, tags, ...taskData } = createTaskData;

    const createdTask = await this.prisma.todo.create({
      data: {
        title: taskData.title,
        description: taskData.description,
        rank: taskData.rank,
        author: { connect: { id: authorId } },
        list: { connect: { id: listId } },
      },
    });

    return createdTask;
  }

  findAll() {
    return `This action returns all tasks`;
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
