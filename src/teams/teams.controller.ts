import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
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
import { Team } from '@prisma/client';
import JwtAuthGuard from 'src/auth/guards/jwtAuth.guard';
import CreateTeamDto from './dto/create-team.dto';
import TeamDto from './dto/team.dto';
import UpdateTeamDto from './dto/update-team.dto';
import { IsTeamAdminGuard } from './guards/isTeamAdmin.guard';
import { TeamsService } from './teams.service';

@ApiTags('team')
@Controller('teams')
@UseInterceptors(ClassSerializerInterceptor)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  // Création d'une équipe
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Création d'une équipe" })
  async create(@Req() request, @Body() teamData: CreateTeamDto): Promise<Team> {
    const createdTeam = await this.teamsService.create(
      request.user.id,
      teamData,
    );

    return createdTeam;
  }

  // Récupération de la liste des équipes
  @Get()
  @ApiQuery({ name: 'withBoards', required: false, enum: ['true', 'false'] })
  @ApiOperation({ summary: 'Récupération de la liste des équipes' })
  async list(@Query('withBoards') withBoards: string): Promise<TeamDto[]> {
    const params = {
      getBoards: withBoards === 'true',
    };
    const teams = this.teamsService.getList(params);
    return teams;
  }

  // Lecture d'une équipe
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'withUsers', required: false, enum: ['true', 'false'] })
  @ApiQuery({ name: 'withBoards', required: false, enum: ['true', 'false'] })
  @ApiOperation({ summary: "Création d'une équipe" })
  async get(
    @Param('id') teamId: string,
    @Query('withUsers') withUsers: string,
    @Query('withBoards') withBoards: string,
  ): Promise<TeamDto> {
    const parsedTeamId = parseInt(teamId);
    const params = {
      getUsers: withUsers === 'true',
      getBoards: withBoards === 'true',
    };
    const team = this.teamsService.getById(parsedTeamId, params);
    return team;
  }

  // Modification d'une équipe
  @Patch(':id')
  @UseGuards(JwtAuthGuard, IsTeamAdminGuard)
  @ApiOperation({ summary: "Modification d'une équipe" })
  async patch(
    @Param('id') teamId: string,
    @Body() teamData: UpdateTeamDto,
  ): Promise<TeamDto> {
    const parsedTeamId = parseInt(teamId);
    this.teamsService.update(parsedTeamId, teamData);
    return;
  }

  // Adhésion à une d'une équipe
  @Post('join')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Entrée dans une équipe' })
  async joinMultiple(@Req() request, @Body() teams: number[]): Promise<void> {
    await this.teamsService.join(request.user.id, teams);

    return;
  }

  // Adhésion à une d'une équipe
  @Post(':id/user')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Entrée dans une équipe' })
  async join(@Req() request, @Param('id') teamId: string): Promise<void> {
    const parsedTeamId = parseInt(teamId);
    await this.teamsService.join(request.user.id, [parsedTeamId]);

    return;
  }

  // Départ d'une équipe
  @Delete(':id/user')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Départ d'une équipe" })
  async leave(@Req() request, @Param('id') teamId: string): Promise<void> {
    const parsedTeamId = parseInt(teamId);
    await this.teamsService.leave(request.user.id, parsedTeamId);

    return;
  }
}
