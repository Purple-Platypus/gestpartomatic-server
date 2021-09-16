import { ApiProperty } from '@nestjs/swagger';
import { MinLength } from 'class-validator';

export class ResetPasswordDto {
  /**
   * UUID de l'utilisateur
   * @example 123e4567-e89b-12d3-a456-426614174000
   */
  @ApiProperty()
  id: string;

  /**
   * Nouveau mot de passe de l'utilisateur
   * @example MonSuperNouveauMotDePasse
   */
  @ApiProperty()
  @MinLength(3)
  password: string;

  /**
   * Token de vérification du demandeur envoyé dans l'email de réinitialisation
   */
  token: string;
}

export default ResetPasswordDto;
