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
import { ListsService } from './lists.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import JwtAuthGuard from 'src/auth/guards/jwtAuth.guard';
import { User } from '.prisma/client';

@ApiTags('lists')
@Controller('lists')
@UseInterceptors(ClassSerializerInterceptor)
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: `Création d'une liste`,
  })
  create(@Body() createListData: CreateListDto) {
    return this.listsService.create(createListData);
  }

  // @Get()
  // findAll() {
  //   return this.listsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.listsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateListDto: UpdateListDto) {
  //   return this.listsService.update(+id, updateListDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.listsService.remove(+id);
  // }
}
