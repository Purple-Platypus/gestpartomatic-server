import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';
import { UpdateListDto } from './update-list.dto';

export class UpdateMultipleListDto {
  /**
   * ID unique de la liste
   * @example 1
   */
  @ApiProperty()
  @IsDefined()
  id: number;

  /**
   * Donnée modifiées de la liste
   * @example 1
   */
  @ApiProperty()
  @IsDefined()
  data: UpdateListDto;
}

export default UpdateMultipleListDto;
