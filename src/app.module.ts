import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { MailModule } from './mails/mail.module';
import { MailService } from './mails/mail.service';
import { TeamsModule } from './teams/teams.module';
import { TodosController } from './todos/todos.controller';
import { TodosModule } from './todos/todos.module';
import { Flux1Module } from './flux1/flux1.module';
import { BoardsModule } from './boards/boards.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    MailModule,
    TeamsModule,
    TodosModule,
    Flux1Module,
    BoardsModule,
  ],
  providers: [MailService],
  controllers: [TodosController],
})
export class AppModule {}
