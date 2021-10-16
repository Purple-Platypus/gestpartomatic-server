import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';
import UpdateTodoDto from './update-todo.dto';

export class UpdateMultipleTodoDto {
  /**
   * ID unique du todo
   * @example 1
   */
  @ApiProperty()
  @IsDefined()
  id: number;

  /**
   * Données modifiées du todo
   * @example 1
   */
  @ApiProperty()
  @IsDefined()
  data: UpdateTodoDto;
}

export default UpdateMultipleTodoDto;
