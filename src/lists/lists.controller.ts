import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { ListsService } from './lists.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import JwtAuthGuard from 'src/auth/guards/jwtAuth.guard';
import UpdateMultipleListDto from './dto/update-multiple-list.dto';

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

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: `Modification d'une liste`,
  })
  update(@Param('id') id: string, @Body() updateListDto: UpdateListDto) {
    return this.listsService.update(+id, updateListDto);
  }

  // Modification d'une liste de lists
  @Patch()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Modification d'une liste de lists" })
  async patchMany(@Body() listsData: UpdateMultipleListDto[]): Promise<void> {
    listsData.forEach((updatedList) => {
      this.listsService.update(updatedList.id, updatedList.data);
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: `Suppression d'une liste`,
  })
  remove(@Param('id') id: string) {
    return this.listsService.remove(+id);
  }
}
