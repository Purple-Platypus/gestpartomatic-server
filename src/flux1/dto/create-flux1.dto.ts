import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDefined, ValidateNested } from 'class-validator';
import { CreateFlux1IemDto } from './create-flux1-item.dto';

export class CreateFlux1Dto {
  /**
   * Liste des données du flux 1
   */
  @ApiProperty()
  @IsDefined()
  @IsArray()
  @ValidateNested()
  @Type(() => CreateFlux1IemDto)
  data: CreateFlux1IemDto[];
}
