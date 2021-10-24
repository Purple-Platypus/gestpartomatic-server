import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateListDto } from './dto/create-list.dto';
import ListDto from './dto/list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import UpdateMultipleListDto from './dto/update-multiple-list.dto';

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
        tasks: true,
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

  async update(
    listId: number,
    updateListData: UpdateListDto,
  ): Promise<ListDto> {
    const updatedList = await this.prisma.list.update({
      where: {
        id: listId,
      },
      data: updateListData,
      select: {
        id: true,
        name: true,
        progression: true,
        rank: true,
      },
    });
    return updatedList;
  }

  async updateMany(updateData: UpdateMultipleListDto[]): Promise<void> {
    updateData.forEach((updatedList) => {
      this.update(updatedList.id, updatedList.data);
    });
  }

  async remove(listId: number): Promise<void> {
    const deletedList = await this.prisma.list.delete({
      where: { id: listId },
      select: {
        rank: true,
        boardId: true,
      },
    });

    await this.prisma.list.updateMany({
      data: {
        rank: {
          decrement: 1,
        },
      },
      where: {
        AND: [
          { rank: { gt: deletedList.rank } },
          { boardId: deletedList.boardId },
        ],
      },
    });
  }
}
