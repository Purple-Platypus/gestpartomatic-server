import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Team } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import CreateTeamDto from './dto/create-team.dto';
import TeamDto from './dto/team.dto';
import UpdateTeamDto from './dto/update-team.dto';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  // Création d'une nouvelle équipe
  public async create(userId: string, teamData: CreateTeamDto): Promise<Team> {
    try {
      const createdTeam = await this.prisma.team.create({
        data: {
          name: teamData.name,
          image: teamData.image,
          description: teamData.description,
          users: {
            create: [{ userId: userId, role: 'ADMIN' }],
          },
          boards: {
            create: [
              {
                name: 'Ô mon tableau',
                lists: {
                  create: [
                    {
                      name: 'À faire',
                      rank: 0,
                      todos: {
                        create: [
                          {
                            title: `Inviter d'autres utilisateurs`,
                            author: userId,
                            rank: 0,
                            description: `Partagez vos tableaux en ivitant de nouveaux utilisateurs.`,
                          },
                        ],
                      },
                    },
                    { name: 'En cours', rank: 1 },
                    { name: 'Terminé', rank: 2 },
                  ],
                },
              },
            ],
          },
        },
      });

      return createdTeam;
    } catch (error) {
      if (error.code == 'P2002') {
        throw new HttpException(
          'Duplicate key : ' + error.meta.target.join(', '),
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      console.log(error);

      throw new HttpException('Ouch !', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Récupération d'une équipe
  public async getList(params): Promise<TeamDto[]> {
    const selectParams = {
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
      },
    };

    // Ajout conditionnel des boards
    if (params.getBoards) {
      selectParams.select['boards'] = {
        select: {
          id: true,
          name: true,
        },
      };
    }

    const teams = await this.prisma.team.findMany(selectParams);
    return teams;
  }

  // Récupération d'une équipe
  public async getById(teamId: number, params): Promise<TeamDto> {
    const selectParams = {
      where: { id: teamId },
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
      },
    };

    // Ajout conditionnel des users
    if (params.getUsers) {
      selectParams.select['users'] = {
        select: {
          role: true,
          user: {
            select: {
              id: true,
              email: true,
              username: true,
              nickname: true,
              avatar: true,
            },
          },
        },
      };
    }

    // Ajout conditionnel des boards
    if (params.getBoards) {
      selectParams.select['boards'] = {
        select: {
          id: true,
          name: true,
        },
      };
    }

    try {
      const team = await this.prisma.team.findUnique(selectParams);

      return team;
    } catch (error) {
      throw new HttpException('Ouch !', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Modification d'une équipe
  public async update(teamId: number, teamData: UpdateTeamDto): Promise<void> {
    await this.prisma.team.update({
      where: {
        id: teamId,
      },
      data: teamData,
    });
  }

  // Adhésion de l'utilisateur connecté à une équipe
  public async join(userId: string, teams: number[]): Promise<void> {
    const memberships = teams.map((teamId) => {
      return {
        userId: userId,
        teamId: teamId,
      };
    });
    try {
      await this.prisma.teamsOnUsers.createMany({
        data: memberships,
      });
    } catch (error) {
      switch (error.code) {
        case 'P2002':
          throw new HttpException(
            'Duplicate key : ' + error.meta.target.join(', '),
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
          break;
        case 'P2003':
          throw new HttpException('Not found', HttpStatus.NOT_FOUND);
          break;
        default:
          throw new HttpException('Ouch !', HttpStatus.INTERNAL_SERVER_ERROR);
          break;
      }
    }
  }

  // Départ de l'utilisateur connecté à une équipe
  public async leave(userId: string, teamId: number): Promise<void> {
    try {
      await this.prisma.teamsOnUsers.deleteMany({
        where: {
          userId: userId,
          teamId: teamId,
        },
      });
    } catch (error) {
      switch (error.code) {
        case 'P2002':
          throw new HttpException(
            'Duplicate key : ' + error.meta.target.join(', '),
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
          break;
        case 'P2003':
          throw new HttpException('Not found', HttpStatus.NOT_FOUND);
          break;
        default:
          throw new HttpException('Ouch !', HttpStatus.INTERNAL_SERVER_ERROR);
          break;
      }
    }
  }
}
