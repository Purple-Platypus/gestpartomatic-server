import { ApiProperty } from '@nestjs/swagger';
import { List, User } from '@prisma/client';
import { IsOptional } from 'class-validator';

export class BoardDto {
  /**
   * ID unique du tableau
   * @example 1
   */
  @ApiProperty()
  id: number;

  /**
   * Titre du tableau
   * @example Projet Z
   */
  @ApiProperty()
  name: string;

  /**
   * Description du tableau
   * @example Take on the world !
   */
  @ApiProperty()
  @IsOptional()
  description?: string;

  /**
   * Etat privé du tableau
   * @example true
   */
  @ApiProperty()
  isPrivate: boolean;

  /**
   * Créateur du tableau
   */
  @ApiProperty()
  creator: User;

  /**
   * Utilisateurs ayant accès au tableau
   */
  @ApiProperty()
  watchers?: User[];

  /**
   * Colonnes du tableau
   */
  @ApiProperty()
  lists: List[];
}

export default BoardDto;
