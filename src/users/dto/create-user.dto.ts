import { ApiHideProperty, ApiProperty, OmitType } from '@nestjs/swagger';
import { MinLength } from 'class-validator';
import UserDto from './user.dto';

export class CreateUserDto extends OmitType(UserDto, [
  'id',
  'nickname',
  'settinDarkMode',
  'refreshToken',
] as const) {
  /**
   * Mot de passe de l'utilisateur
   * @example MonSuperMotDePasse
   */
  @ApiProperty()
  @MinLength(3)
  password: string;
}

export default CreateUserDto;
