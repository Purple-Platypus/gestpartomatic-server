import { ApiProperty } from '@nestjs/swagger';
import { List, Milestone, TagsOnTodos, User } from '@prisma/client';
import { IsDefined, IsEnum, IsOptional } from 'class-validator';

enum Priority {
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
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
   * Jalon du todo
   */
  @ApiProperty()
  @IsOptional()
  milestone?: Milestone;

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
  @IsDefined()
  @IsEnum(Priority)
  priority: 'NORMAL' | 'HIGH';

  /**
   * Etat réalisé du todo
   * @example false
   */
  @ApiProperty()
  @IsOptional()
  isDone?: boolean;

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
  author: User;

  /**
   * Utilisateurs assignés au todo
   */
  @ApiProperty()
  assignees?: User[];

  /**
   * Tags appliqués au todo
   */
  @ApiProperty()
  tags?: TagsOnTodos[];

  /**
   * Commentaires du todo
   */
  @ApiProperty()
  comments?: Comment[];
}

export default TodoDto;
