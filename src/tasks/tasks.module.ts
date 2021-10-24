import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksGateway } from './tasks.gateway';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [TasksGateway, TasksService, PrismaService],
})
export class TasksModule {}
