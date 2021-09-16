import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDefined,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

enum TypeFlux1 {
  STRING = 'STRING',
  INT = 'INT',
}

export class Flux1Dto {
  /**
   * ID unique de la donnée
   * @example 1
   */
  @ApiProperty()
  @IsDefined()
  @IsInt()
  id: number;

  /**
   * Article de la donnée
   * @example 1
   */
  @ApiProperty()
  @IsDefined()
  @IsInt()
  article: number;

  /**
   * Position de la donnée
   * @example 99
   */
  @ApiProperty()
  @IsDefined()
  @IsInt()
  position: number;

  /**
   * Nature de la donnée parmi [STRING, INT]
   * @example STRING
   */
  @ApiProperty()
  @IsDefined()
  @IsEnum(TypeFlux1)
  nature: 'STRING' | 'INT';

  /**
   * Longueur de la donnée
   * @example 9
   */
  @ApiProperty()
  @IsDefined()
  @IsInt()
  length: number;

  /**
   * Caractère obligatoire de la donnée
   * @example true
   */
  @ApiProperty()
  @IsDefined()
  @IsBoolean()
  required: boolean;

  /**
   * Nom de la donnée
   * @example "Ma jolie donnée"
   */
  @ApiProperty()
  @IsDefined()
  @IsString()
  label: string;

  /**
   * Description de la donnée
   * @example "Cette donnée peut être exposée sur une cheminée ou dans une vitrine"
   */
  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  /**
   * Attribut "A" ???
   * @example true
   */
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  a?: boolean;

  /**
   * Attribut "C" ???
   * @example true
   */
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  c?: boolean;

  /**
   * Colonne en base de donnée
   * @example ma_colonne
   */
  @ApiProperty()
  @IsString()
  @IsOptional()
  db_column?: string;

  /**
   * Commentaire sur la donnée
   * @example "Cette donnée est formidable"
   */
  @ApiProperty()
  @IsString()
  @IsOptional()
  comment?: string;
}

export default Flux1Dto;
