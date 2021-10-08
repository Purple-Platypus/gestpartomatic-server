import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createBoardData: CreateBoardDto) {
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

  // findAll() {
  //   return `This action returns all boards`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} board`;
  // }

  // update(id: number, updateBoardDto: UpdateBoardDto) {
  //   return `This action updates a #${id} board`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} board`;
  // }
}
