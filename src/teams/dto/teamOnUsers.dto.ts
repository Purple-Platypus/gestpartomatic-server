import { ApiProperty } from '@nestjs/swagger';
import UserDto from 'src/users/dto/user.dto';

export class TeamOnUsersDto {
  /**
   * Rôle de l'utilisateur dans l'équipe
   * @example USER
   */
  @ApiProperty()
  role: string;

  /**
   * Utilisateur membre de l'équipe
   */
  @ApiProperty()
  user: UserDto;
}

export default TeamOnUsersDto;
