import { User } from '.prisma/client';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import JwtAuthGuard from 'src/auth/guards/jwtAuth.guard';
import { BoardsService } from './boards.service';
import BoardDto from './dto/board.dto';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { BoardCreatorGuard } from './guards/boardCreator.guard';
import { BoardVisibilityGuard } from './guards/boardVisibility.guard';

@ApiTags('boards')
@Controller('boards')
@UseInterceptors(ClassSerializerInterceptor)
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: `Création d'un kanban`,
  })
  create(
    @Req() req: User,
    @Body() createBoardData: CreateBoardDto,
  ): Promise<BoardDto> {
    return this.boardsService.create(req['user'].id, createBoardData);
  }

  @Post(':id/guest')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: `Ajout d'un utilisateur de board`,
  })
  createGuests(
    @Param('id') id: string,
    @Body() { userId, role },
  ): Promise<any> {
    return this.boardsService.createGuest(+id, userId, role);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: `Récupération de la liste des kanbans visibles par un user`,
  })
  findAll(@Req() req: User): Promise<BoardDto[]> {
    return this.boardsService.findAll(req['user'].id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, BoardVisibilityGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'deep', required: false, enum: ['true', 'false'] })
  @ApiOperation({
    summary: `Récupération d'un' kanban par id`,
  })
  findOne(@Query('deep') deep: string, @Param('id') boardId: string) {
    const deepSearch = deep === 'true';
    return this.boardsService.findOne(+boardId, deepSearch);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: `Modification d'un board`,
  })
  update(
    @Param('id') id: string,
    @Body() updateBoardData: UpdateBoardDto,
  ): Promise<BoardDto> {
    return this.boardsService.update(+id, updateBoardData);
  }

  @Patch(':boardId/guest/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: `Modification d'un guest`,
  })
  updateGuest(
    @Param('boardId') boardId: string,
    @Param('userId') userId: string,
    @Body() updateGuestData: UpdateBoardDto,
  ): Promise<void> {
    return this.boardsService.updateGuest(+boardId, userId, updateGuestData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: `Suppression d'un board`,
  })
  remove(@Param('id') id: string) {
    return this.boardsService.remove(+id);
  }

  @Delete(':boardId/guest/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: `Suppression d'un utilisateur de board`,
  })
  removeGuest(
    @Param('boardId') boardId: string,
    @Param('userId') userId: string,
  ) {
    return this.boardsService.removeGuest(+boardId, userId);
  }
}
