import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import CreateUserDto from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import UpdateUserDto from './dto/update-user.dto';
import UserDto from './dto/user.dto';
import PartialUserDto from './dto/partial-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Création
  async create(userData: CreateUserDto): Promise<UserDto> {
    userData = {
      ...userData,
      ...{
        createdTodos: {
          create: [
            {
              isPrivate: true,
              rank: 0,
              title: `Votre première tâche`,
              description: `Au boulot !!`,
            },
          ],
        },
      },
    };

    try {
      const createdUser = await this.prisma.user.create({
        data: userData,
        select: {
          id: true,
          email: true,
          username: true,
          nickname: true,
          avatar: true,
        },
      });

      return createdUser;
    } catch (error) {
      console.log(error);

      throw new HttpException('Ouch !', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Mise à jour
  async update(id: string, userData: UpdateUserDto): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: userData,
    });
    return updatedUser;
  }

  // Ecriture en base du token de rafraichissement
  async setCurrentRefreshToken(refreshToken: string, id: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id },
      data: { refreshToken: hashedRefreshToken },
    });
  }

  // Suppression du token de rafraichissement en base
  async removeRefreshToken(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: {
        refreshToken: null,
      },
    });
  }

  // Récupération d'un user par son email
  async getByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (user) {
      return user;
    }
    throw new HttpException('Cette adresse est inconnue', HttpStatus.NOT_FOUND);
  }

  // Récupération d'un user par son id
  async getById(id: string, params?): Promise<UserDto> {
    const selectParams = {
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        nickname: true,
        avatar: true,
        settingDarkMode: true,
      },
    };

    // Ajout conditionnel du refresh token
    if (params && params.getRefreshToken) {
      selectParams.select['refreshToken'] = true;
    }

    const user = await this.prisma.user.findUnique(selectParams);

    if (!user) {
      throw new HttpException(
        ` Cet utilisateur n'existe pas`,
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  // Récupération d'un user après contrôle deu token de rafraichissement
  async getUserIfRefreshTokenMatches(refreshToken: string, id: string) {
    const user = await this.getById(id, { getRefreshToken: true });

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async getAll(): Promise<PartialUserDto[]> {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        nickname: true,
        avatar: true,
      },
    });
    return users;
  }
}
