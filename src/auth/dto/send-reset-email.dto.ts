import { IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendResetEmailDto {
  /**
   * Adresse électronique de l'utilisateur
   * @example bob_leponge@exemple.fr
   */
  @ApiProperty()
  @IsEmail()
  email: string;
}

export default SendResetEmailDto;
