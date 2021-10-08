import { ApiProperty } from '@nestjs/swagger';
import { List, User } from '@prisma/client';
import { IsDefined, IsOptional } from 'class-validator';

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
  @IsDefined()
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
  @IsOptional()
  isPrivate?: boolean;

  /**
   * Créateur du tableau
   */
  @ApiProperty()
  @IsOptional()
  creator?: User;

  /**
   * Utilisateurs ayant accès au tableau
   */
  @ApiProperty()
  @IsOptional()
  watchers?: User[];

  /**
   * Colonnes du tableau
   */
  @ApiProperty()
  @IsOptional()
  lists?: List[];
}

export default BoardDto;
