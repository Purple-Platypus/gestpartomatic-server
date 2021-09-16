import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, MaxLength, MinLength } from 'class-validator';

export class UserDto {
  /**
   * Rôle de l'utilisateur
   * @example USER
   */
  @ApiProperty()
  id: string;

  /**
   * Adresse électronique de l'utilisateur
   * @example bob_leponge@exemple.fr
   */
  @ApiProperty()
  @IsEmail()
  email: string;

  /**
   * Identifiant unique de l'utilisateur
   * @example bob_leponge
   */
  @ApiProperty({
    pattern: '^[\\d\\.a-z_-]{1,25}$',
  })
  @MinLength(1)
  @MaxLength(25)
  username: string;

  /**
   * Surnom de l'utilisateur
   * @example "Bob L'Eponge"
   */
  @ApiProperty()
  @MinLength(1)
  @MaxLength(50)
  nickname: string;

  /**
   * Avatar de l'utilisateur encodé en base64
   * @example data:image/png;base64,...
   */
  @ApiProperty()
  avatar: string;

  /**
   * Mode sombre activé
   * @example false
   */
  @ApiProperty()
  settinDarkMode?: boolean;

  @ApiHideProperty()
  refreshToken?: string;
}

export default UserDto;
