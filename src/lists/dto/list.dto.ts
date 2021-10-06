import { ApiProperty } from '@nestjs/swagger';
import { Todo } from '@prisma/client';
import { IsDefined, IsEnum } from 'class-validator';

enum Progression {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export class ListDto {
  /**
   * ID unique de la liste
   * @example 1
   */
  @ApiProperty()
  id: number;

  /**
   * Titre de la liste
   * @example En cours
   */
  @ApiProperty()
  @IsDefined()
  name: string;

  /**
   * Description de la liste
   * @example Travaux lancés et pas tout à fait terminés
   */
  @ApiProperty()
  @IsDefined()
  rank: number;

  /**
   * Etat privé du tableau
   * @example true
   */
  @ApiProperty()
  @IsDefined()
  @IsEnum(Progression)
  progression: 'TODO' | 'IN_PROGRESS' | 'DONE';

  /**
   * Tableau dans lequel la liste est affichée
   */
  @ApiProperty()
  @IsDefined()
  boardId: number;

  /**
   * Utilisateurs ayant accès au tableau
   */
  @ApiProperty()
  todos: Todo[];
}

export default ListDto;
