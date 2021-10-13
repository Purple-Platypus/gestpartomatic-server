import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateListDto } from './dto/create-list.dto';
import ListDto from './dto/list.dto';
import { UpdateListDto } from './dto/update-list.dto';

@Injectable()
export class ListsService {
  constructor(private prisma: PrismaService) {}

  async create(createListData: CreateListDto): Promise<ListDto> {
    const createdList = await this.prisma.list.create({
      data: {
        name: createListData.name,
        rank: createListData.rank,
        board: {
          connect: {
            id: createListData.boardId,
          },
        },
      },
      include: {
        todos: true,
      },
    });
    return createdList;
  }

  // findAll() {
  //   return `This action returns all lists`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} list`;
  // }

  // update(id: number, updateListDto: UpdateListDto) {
  //   return `This action updates a #${id} list`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} list`;
  // }
}
