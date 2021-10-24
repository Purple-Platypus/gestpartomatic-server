import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: 'http://localhost:3000', credentials: true },
})
export class TasksGateway implements OnGatewayConnection {
  constructor(private readonly tasksService: TasksService) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(socket: Socket) {
    await this.tasksService.getUserFromSocket(socket);
  }

  @SubscribeMessage('watchBoard')
  watch(
    @ConnectedSocket() socket: Socket,
    @MessageBody() boardId: string,
  ): void {
    socket.join('board_' + boardId);
  }

  @SubscribeMessage('createTask')
  async create(
    @ConnectedSocket() socket: Socket,
    @MessageBody() createTaskDto: CreateTaskDto,
  ) {
    const author = await this.tasksService.getUserFromSocket(socket);
    const createdTask = await this.tasksService.create(
      author.id,
      createTaskDto,
    );
    socket.emit('addTask', createdTask);
  }

  @SubscribeMessage('findOneTask')
  findOne(@MessageBody() id: number) {
    return this.tasksService.findOne(id);
  }

  @SubscribeMessage('updateTask')
  update(@MessageBody() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(updateTaskDto.id, updateTaskDto);
  }

  @SubscribeMessage('removeTask')
  remove(@MessageBody() id: number) {
    return this.tasksService.remove(id);
  }

  afterInit() {
    console.log('Initialized!');
  }
}
