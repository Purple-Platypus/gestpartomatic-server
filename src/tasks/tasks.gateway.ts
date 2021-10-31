import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  WsResponse,
} from '@nestjs/websockets';
import { TasksService } from './tasks.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Server, Socket } from 'socket.io';
import CreateTaskDto from './dto/create-task.dto';
import TaskDto from './dto/task.dto';
import { TagsService } from 'src/tags/tags.service';

@WebSocketGateway({
  cors: { origin: 'http://localhost:3000', credentials: true },
})
export class TasksGateway implements OnGatewayConnection {
  constructor(
    private readonly tasksService: TasksService,
    private readonly tagsService: TagsService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(socket: Socket) {
    await this.tasksService.getUserFromSocket(socket);
  }

  @SubscribeMessage('watchBoard')
  watch(
    @ConnectedSocket() socket: Socket,
    @MessageBody() boardId: number,
  ): void {
    socket.join('board_' + boardId);
  }

  @SubscribeMessage('createTask')
  async create(
    @ConnectedSocket() socket: Socket,
    @MessageBody('boardId') boardId: number,
    @MessageBody('task') taskData: CreateTaskDto,
  ): Promise<TaskDto> {
    const author = await this.tasksService.getUserFromSocket(socket);
    const createdTask = await this.tasksService.create(author.id, taskData);

    this.server.to('board_' + boardId).emit('addTask', createdTask);
    return createdTask;
  }

  @SubscribeMessage('updateTask')
  async update(
    @MessageBody('boardId') boardId: number,
    @MessageBody('updateData') updateData: UpdateTaskDto,
  ) {
    const updatedTask = await this.tasksService.update(updateData);
    this.server.to('board_' + boardId).emit('updateTask', updatedTask);
    return updatedTask;
  }

  @SubscribeMessage('removeTag')
  async removeTag(
    @MessageBody('boardId') boardId: number,
    @MessageBody('tagId') tagId: number,
  ) {
    await this.tagsService.remove(tagId);
    this.server.to('board_' + boardId).emit('removeTag', tagId);
  }

  afterInit() {
    console.log('Initialized!');
  }
}
