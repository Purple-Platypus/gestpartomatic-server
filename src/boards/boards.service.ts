import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import BoardDto from './dto/board.dto';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardsService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    createBoardData: CreateBoardDto,
  ): Promise<BoardDto> {
    try {
      const createdBoard = await this.prisma.board.create({
        data: {
          name: createBoardData.name,
          description: createBoardData.description,
          creator: {
            connect: {
              id: userId,
            },
          },
          lists: {
            create: [
              {
                name: 'À faire',
                rank: 0,
                todos: {
                  create: [
                    {
                      title: `Inviter d'autres utilisateurs`,
                      author: {
                        connect: {
                          id: userId,
                        },
                      },
                      rank: 0,
                      description: `Partagez vos tableaux en invitant de nouveaux utilisateurs.`,
                      isPrivate: false,
                    },
                  ],
                },
              },
              { name: 'En cours', rank: 1 },
              { name: 'Terminé', rank: 2 },
            ],
          },
        },
      });

      return createdBoard;
    } catch (error) {
      console.log(error);

      throw new HttpException('Ouch !', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(userId: string): Promise<BoardDto[]> {
    const selectParams = {
      select: {
        id: true,
        name: true,
        isPrivate: true,
        creatorId: true,
        isArchived: true,
      },
      where: {
        OR: [
          { creatorId: userId },
          { isPrivate: false },
          {
            guests: {
              some: {
                userId: userId,
              },
            },
          },
        ],
      },
    };

    const userBoards = await this.prisma.board.findMany(selectParams);
    return userBoards;
  }

  async findOne(boardId: number, deepSearch: boolean): Promise<BoardDto> {
    const selectParams = {
      select: {
        id: true,
        name: true,
        description: true,
        isPrivate: true,
      },
      where: {
        id: boardId,
      },
    };

    if (deepSearch) {
      selectParams.select['lists'] = {
        include: {
          todos: true,
        },
      };
    }

    const board = await this.prisma.board.findUnique(selectParams);

    return board;
  }

  async update(
    boardId: number,
    updateBoardData: UpdateBoardDto,
  ): Promise<BoardDto> {
    const updatedBoard = await this.prisma.board.update({
      where: {
        id: boardId,
      },
      data: updateBoardData,
    });
    return updatedBoard;
  }

  async remove(boardId: number) {
    await this.prisma.board.delete({
      where: { id: boardId },
    });
  }

  async checkCreator(userId: string, boardId: number): Promise<boolean> {
    const matchingBoardId = await this.prisma.board.findFirst({
      select: {
        id: true,
      },
      where: {
        AND: [{ id: boardId }, { creatorId: userId }],
      },
    });

    return matchingBoardId !== null;
  }

  async checkUserAccess(userId: string, boardId: number): Promise<boolean> {
    const matchingBoardId = await this.prisma.board.findFirst({
      select: {
        id: true,
      },
      where: {
        AND: [
          { id: boardId },
          {
            OR: [
              { creatorId: userId },
              { isPrivate: false },
              {
                guests: {
                  some: {
                    userId: userId,
                  },
                },
              },
            ],
          },
        ],
      },
    });

    return matchingBoardId !== null;
  }
}
