import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFlux1Dto } from './dto/create-flux1.dto';
import Flux1Dto from './dto/flux1.dto';
import { UpdateFlux1Dto } from './dto/update-flux1.dto';

@Injectable()
export class Flux1Service {
  constructor(private prisma: PrismaService) {}

  async create(createFlux1Data: CreateFlux1Dto) {
    await this.prisma.$transaction([
      this.prisma.flux1.deleteMany(),
      this.prisma.flux1.createMany(createFlux1Data),
    ]);
    const flux1 = await this.prisma.flux1.findMany();
    return flux1;
  }

  async findAll(): Promise<Flux1Dto[]> {
    const selectParams = {
      select: {
        id: true,
        article: true,
        position: true,
        nature: true,
        length: true,
        required: true,
        label: true,
        description: true,
        a: true,
        c: true,
        db_column: true,
        comment: true,
      },
    };

    const flux1 = await this.prisma.flux1.findMany(selectParams);
    return flux1;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} flux1`;
  // }

  // update(id: number, updateFlux1Dto: UpdateFlux1Dto) {
  //   return `This action updates a #${id} flux1`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} flux1`;
  // }
}
