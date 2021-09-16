import { Module } from '@nestjs/common';
import { Flux1Service } from './flux1.service';
import { Flux1Controller } from './flux1.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [Flux1Controller],
  providers: [Flux1Service, PrismaService],
})
export class Flux1Module {}
