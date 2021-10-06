import { ApiProperty } from '@nestjs/swagger';
import { List, User } from '@prisma/client';
import { IsOptional } from 'class-validator';

export class BoardDto {
  /**
   * ID unique du todo
   * @example 1
   */
  @ApiProperty()
  id: number;

  /**
   * Titre du todo
   * @example Acheter du lait
   */
  @ApiProperty()
  name: string;

  /**
   * Description du todo
   * @example Ne pas oublier les cookies
   */
  @ApiProperty()
  @IsOptional()
  description?: string;

  /**
   * Etat réalisé du todo
   * @example false
   */
  @ApiProperty()
  isPrivate: boolean;

  /**
   * Créateur du todo
   */
  @ApiProperty()
  creator: User;

  /**
   * Utilisateurs assignés au todo
   */
  @ApiProperty()
  watchers?: User[];

  /**
   * Utilisateurs assignés au todo
   */
  @ApiProperty()
  lists: List[];
}

export default BoardDto;
