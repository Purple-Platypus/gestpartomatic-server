import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { Flux1Service } from './flux1.service';
import { CreateFlux1Dto } from './dto/create-flux1.dto';
import { UpdateFlux1Dto } from './dto/update-flux1.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import Flux1Dto from './dto/flux1.dto';

@ApiTags('flux1')
@Controller('flux1')
@UseInterceptors(ClassSerializerInterceptor)
export class Flux1Controller {
  constructor(private readonly flux1Service: Flux1Service) {}

  @Post()
  @ApiOperation({ summary: 'Mise à jour de la totalité des données du flux 1' })
  create(@Body() createFlux1Dto: CreateFlux1Dto): Promise<Flux1Dto[]> {
    return this.flux1Service.create(createFlux1Dto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupération de la liste des données du flux 1' })
  findAll() {
    return this.flux1Service.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.flux1Service.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateFlux1Dto: UpdateFlux1Dto) {
  //   return this.flux1Service.update(+id, updateFlux1Dto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.flux1Service.remove(+id);
  // }
}
