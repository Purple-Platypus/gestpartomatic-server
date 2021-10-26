import { ApiProperty } from '@nestjs/swagger';
import { List, User } from '@prisma/client';
import { IsDefined, IsEnum, IsOptional } from 'class-validator';
import { TagDto } from 'src/tags/dto/tag.dto';
import UserDto from 'src/users/dto/user.dto';

enum Priority {
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
}

export class TaskDto {
  /**
   * ID unique de la tâche
   * @example 1
   */
  @ApiProperty()
  @IsDefined()
  id: number;

  /**
   * rang de la tâche dans la liste
   * @example 1
   */
  @ApiProperty()
  @IsDefined()
  rank: number;

  /**
   * Titre de la tâche
   * @example Acheter du lait
   */
  @ApiProperty()
  @IsDefined()
  title: string;

  /**
   * Description de la tâche
   * @example Ne pas oublier les cookies
   */
  @ApiProperty()
  @IsOptional()
  description?: string;

  /**
   * Priorité de la tâche
   * @example NORMAL
   */
  @ApiProperty()
  @IsOptional()
  @IsEnum(Priority)
  priority?: 'NORMAL' | 'HIGH';

  /**
   * Ids des responsables de la tâche
   * @example ['abc', 'def']
   */
  @ApiProperty()
  @IsOptional()
  assignees?: string[];

  /**
   * Ids des étiquettes de la tâche
   * @example [1, 2, 3]
   */
  @ApiProperty()
  @IsOptional()
  tags?: number[];

  /**
   * Liste de la tâche
   */
  @ApiProperty()
  list?: List;

  /**
   * Créateur de la tâche
   */
  @ApiProperty()
  author?: User;

  /**
   * Id de liste à laquelle la tâche est associé
   */
  @ApiProperty()
  listId?: number;

  /**
   * Id de l'auteur de la tâche
   */
  @ApiProperty()
  authorId?: string;

  /**
   * Date de création
   */
  @ApiProperty()
  createdAt?: Date;

  /**
   * Date de modification
   */
  @ApiProperty()
  updatedAt?: Date;
}

export default TaskDto;
