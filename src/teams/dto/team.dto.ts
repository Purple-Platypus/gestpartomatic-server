import { ApiProperty } from '@nestjs/swagger';
import TeamOnUsersDto from './teamOnUsers.dto';

export class TeamDto {
  /**
   * ID unique de l'équipe
   * @example 1
   */
  @ApiProperty()
  id: number;

  /**
   * Nom unique de l'équipe
   * @example La Team Qui Déchire
   */
  @ApiProperty()
  name: string;

  /**
   * Description de l'équipe
   * @example Ceci est une équipe qui déchire vraiment énormément
   */
  @ApiProperty()
  description: string;

  /**
   * Image d'illustrtation encodée en base64
   * @example data:image/png;base64,...
   */
  @ApiProperty()
  image: string;

  /**
   * Liste des membres de l'équipe
   */
  @ApiProperty()
  users?: TeamOnUsersDto[];
}

export default TeamDto;
