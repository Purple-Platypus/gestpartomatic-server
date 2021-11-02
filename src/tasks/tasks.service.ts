import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { parse } from 'cookie';
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
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

    const deepenTags = tags.map((tagId) => {
      return { id: tagId };
    });

    const deepenAssignees = assignees.map((assigneeId) => {
      return { id: assigneeId };
    });

    const createdTask = await this.prisma.todo.create({
      data: {
        title: taskData.title,
        description: taskData.description,
        rank: taskData.rank,
        author: { connect: { id: authorId } },
        list: { connect: { id: listId } },
        tags: {
          connect: deepenTags,
        },
        assignees: {
          connect: deepenAssignees,
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        rank: true,
        listId: true,
        tags: {
          select: {
            id: true,
          },
        },
        assignees: {
          select: {
            id: true,
          },
        },
      },
    });

    return createdTask;
  }

  async update(updateTaskData: UpdateTaskDto) {
    const { id, tags, assignees, ...taskData } = updateTaskData;

    if (tags) {
      const deepenTags = tags.map((tagId) => {
        return { id: tagId };
      });
      Object.assign(taskData, {
        tags: { set: deepenTags },
      });
    }

    if (assignees) {
      const deepenAssignees = assignees.map((assigneeId) => {
        return { id: assigneeId };
      });
      Object.assign(taskData, {
        assignees: { set: deepenAssignees },
      });
    }

    const updatedTask = await this.prisma.todo.update({
      where: {
        id,
      },
      data: taskData,
      // data: {
      //   assignees: {
      //     set: [
      //       {
      //         userId_todoId: {
      //           connect: {
      //             id: 1,
      //           },
      //         },
      //       },
      //     ],
      //   },
      // },
      select: {
        id: true,
        title: true,
        description: true,
        rank: true,
        listId: true,
        tags: {
          select: {
            id: true,
          },
        },
        assignees: {
          select: {
            id: true,
          },
        },
      },
    });
    return updatedTask;
  }
}
