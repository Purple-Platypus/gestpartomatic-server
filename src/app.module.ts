import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { MailModule } from './mails/mail.module';
import { MailService } from './mails/mail.service';
import { TodosController } from './todos/todos.controller';
import { TodosModule } from './todos/todos.module';
import { Flux1Module } from './flux1/flux1.module';
import { BoardsModule } from './boards/boards.module';
import { ListsModule } from './lists/lists.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    MailModule,
    TodosModule,
    Flux1Module,
    BoardsModule,
    ListsModule,
    TasksModule,
  ],
  providers: [MailService],
  controllers: [TodosController],
})
export class AppModule {}
