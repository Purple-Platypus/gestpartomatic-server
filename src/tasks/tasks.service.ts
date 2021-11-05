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

  private selectList = {
    id: true,
    title: true,
    description: true,
    rank: true,
    listId: true,
    priority: true,
    isArchived: true,
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
  };

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
      select: this.selectList,
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
      select: this.selectList,
    });
    return updatedTask;
  }

  async updateTasksOrder(updateData): Promise<void> {
    let updateParams;

    if (updateData.type == 'moved') {
      const isRankIncreased = updateData.oldIndex < updateData.newIndex;
      updateParams = {
        rankChange: isRankIncreased ? { decrement: 1 } : { increment: 1 },
        ranksSelection: {
          gte: isRankIncreased ? updateData.oldIndex : updateData.newIndex,
          lte: isRankIncreased ? updateData.newIndex : updateData.oldIndex,
        },
      };
    } else if (updateData.type == 'added') {
      updateParams = {
        rankChange: { increment: 1 },
        ranksSelection: {
          gte: updateData.newIndex,
        },
      };
    } else {
      updateParams = {
        rankChange: { decrement: 1 },
        ranksSelection: {
          gt: updateData.oldIndex,
        },
      };
    }

    await this.updateRanks(updateData.listId, updateParams);

    if (updateData.type != 'removed') {
      await this.update({
        id: updateData.taskId,
        rank: updateData.newIndex,
        listId: updateData.listId,
      });
    }
  }

  private async updateRanks(listId, updateParams): Promise<void> {
    await this.prisma.todo.updateMany({
      data: {
        rank: updateParams.rankChange,
      },
      where: {
        AND: [
          {
            rank: updateParams.ranksSelection,
          },
          { listId },
        ],
      },
    });
  }
}
