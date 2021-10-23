import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsOptional } from 'class-validator';
import TodoDto from 'src/todos/dto/todo.dto';

export class TagDto {
  /**
   * ID unique du tableau
   * @example 1
   */
  @ApiProperty()
  id: number;

  /**
   * Libellé de l'étiquette
   * @example Urgent
   */
  @ApiProperty()
  @IsDefined()
  label: string;

  /**
   * Couleur de l'étiquette
   * @example #ff0000
   */
  @ApiProperty()
  @IsDefined()
  color: string;

  /**
   * Todos rattachés à l'étiquette
   */
  @ApiProperty()
  @IsOptional()
  todos?: TodoDto[];
}
