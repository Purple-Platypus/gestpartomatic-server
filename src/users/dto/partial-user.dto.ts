import { PickType } from '@nestjs/swagger';
import UserDto from './user.dto';

export class PartialUserDto extends PickType(UserDto, [
  'id',
  'username',
  'nickname',
  'avatar',
] as const) {}

export default PartialUserDto;
