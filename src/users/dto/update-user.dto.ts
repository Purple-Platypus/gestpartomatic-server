import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsOptional, MaxLength, MinLength } from 'class-validator';
import CreateUserDto from './create-user.dto';

export class UpdateUserDto extends PartialType(
  PickType(CreateUserDto, ['password', 'avatar'] as const),
) {
  /**
   * Surnom de l'utilisateur
   * @example "Bob L'Eponge"
   */
  @ApiProperty()
  @MinLength(1)
  @MaxLength(50)
  @IsOptional()
  nickname?: string;
}

export default UpdateUserDto;
