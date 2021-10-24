import { ApiProperty } from '@nestjs/swagger';
import { List, User } from '@prisma/client';
import { IsDefined, IsEnum, IsOptional } from 'class-validator';

enum Priority {
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
}

enum Progression {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export class TodoDto {
  /**
   * ID unique du todo
   * @example 1
   */
  @ApiProperty()
  @IsDefined()
  id: number;

  /**
   * rang du todo dans la liste
   * @example 1
   */
  @ApiProperty()
  @IsDefined()
  rank: number;

  /**
   * Titre du todo
   * @example Acheter du lait
   */
  @ApiProperty()
  @IsDefined()
  title: string;

  /**
   * Description du todo
   * @example Ne pas oublier les cookies
   */
  @ApiProperty()
  @IsOptional()
  description?: string;

  /**
   * Date de fin
   * @example 2021-07-04
   */
  @ApiProperty()
  @IsOptional()
  deadline?: Date;

  /**
   * Priorité du todo
   * @example NORMAL
   */
  @ApiProperty()
  @IsOptional()
  @IsEnum(Priority)
  priority?: 'NORMAL' | 'HIGH';

  /**
   * Etat réalisé du todo
   * @example false
   */
  @ApiProperty()
  @IsOptional()
  @IsEnum(Progression)
  progression?: 'TODO' | 'IN_PROGRESS' | 'DONE';

  /**
   * Etat privé du todo
   * @example false
   */
  @ApiProperty()
  @IsOptional()
  isPrivate?: boolean;

  /**
   * Etat archivé du todo
   * @example false
   */
  @ApiProperty()
  @IsOptional()
  isArchived?: boolean;

  /**
   * Liste du todo
   */
  @ApiProperty()
  list?: List;

  /**
   * Créateur du todo
   */
  @ApiProperty()
  author?: User;

  /**
   * Id de liste à laquelle le todo est associé
   */
  @ApiProperty()
  listId?: number;

  /**
   * Id de l'auteur du todo
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

export default TodoDto;
