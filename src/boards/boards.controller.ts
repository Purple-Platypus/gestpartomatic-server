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
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import JwtAuthGuard from 'src/auth/guards/jwtAuth.guard';
import { BoardsService } from './boards.service';
import BoardDto from './dto/board.dto';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

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

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: `Récupération de la liste des kanbans visibles par un user`,
  })
  findAll(@Req() req: User): Promise<BoardDto[]> {
    return this.boardsService.findAll(req['user'].id);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.boardsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto) {
  //   return this.boardsService.update(+id, updateBoardDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.boardsService.remove(+id);
  // }
}
