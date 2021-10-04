import { ApiProperty } from '@nestjs/swagger';
import { List, Milestone, Tag, TagsOnTodos, User } from '@prisma/client';
import { IsOptional } from 'class-validator';

export class TodoDto {
  /**
   * ID unique du todo
   * @example 1
   */
  @ApiProperty()
  id: number;

  /**
   * rang du todo dans la liste
   * @example 1
   */
  @ApiProperty()
  rank: number;

  /**
   * Titre du todo
   * @example Acheter du lait
   */
  @ApiProperty()
  title: string;

  /**
   * Description du todo
   * @example Ne pas oublier les cookies
   */
  @ApiProperty()
  description?: string;

  /**
   * Jalon du todo
   */
  @ApiProperty()
  milestone?: Milestone;

  /**
   * Date de fin
   * @example 2021-07-04
   */
  @ApiProperty()
  deadline?: Date;

  /**
   * Etat réalisé du todo
   * @example false
   */
  @ApiProperty()
  @IsOptional()
  isDone?: boolean;

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
