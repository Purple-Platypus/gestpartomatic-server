import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Patch,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import JwtAuthGuard from 'src/auth/guards/jwtAuth.guard';
import RequestWithUser from 'src/auth/interfaces/requestWithUser.interface';
import PartialUserDto from './dto/partial-user.dto';
import UpdateUserDto from './dto/update-user.dto';
import UserDto from './dto/user.dto';
import { UsersService } from './users.service';

@ApiTags('user')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Récupération de l'utilisateur connecté
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'withBoards', required: false, enum: ['true', 'false'] })
  @ApiOperation({
    summary: "Lecture de l'utilisateur connecté",
  })
  async getProfile(
    @Req() req: User,
    @Query('withBoards') withBoards: string,
  ): Promise<UserDto> {
    const params = {
      getBoards: withBoards === 'true',
    };

    const user = await this.usersService.getById(req['user'].id, params);
    return user;
  }

  // Récupération de la liste des utilisateurs
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Récupération de la liste des utilisateurs',
  })
  async getAllProfile(): Promise<PartialUserDto[]> {
    const users = await this.usersService.getAll();
    return users;
  }

  // Modification de l'utilisateur connecté
  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Mise à jour de l'utilisateur connecté",
  })
  @ApiBearerAuth()
  async patchUser(
    @Req() req: RequestWithUser,
    @Body() patchData: UpdateUserDto,
  ): Promise<UserDto> {
    const patchedUser = await this.usersService.update(req.user.id, patchData);
    return patchedUser;
  }
}
